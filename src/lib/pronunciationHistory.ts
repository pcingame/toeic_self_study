// Per-word pronunciation practice history, kept client-side in localStorage.
// There's no server-side pronunciation-attempt table, so this stays local
// rather than reaching for a DB migration for a lightweight progress badge.

const STORAGE_KEY = "pronunciation-history";

// Score (out of 100) a word's best attempt must reach to count as mastered.
// Matches the "Tốt" tier threshold in PronunciationRecorder.
export const MASTERY_THRESHOLD = 70;

export interface WordHistory {
  best: number;
  attempts: number;
  lastScore: number;
  lastAt: string;
}

export type HistoryMap = Record<string, WordHistory>;

function storageKey(word: string): string {
  return word.trim().toLowerCase();
}

function readAll(): HistoryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryMap) : {};
  } catch {
    return {};
  }
}

function writeAll(data: HistoryMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private browsing, quota) -- history just won't persist.
  }
}

function eventName(word: string): string {
  return `pronunciation-history:${storageKey(word)}`;
}

export function getWordHistory(word: string): WordHistory | null {
  return readAll()[storageKey(word)] ?? null;
}

export function getAllWordHistory(): HistoryMap {
  return readAll();
}

export function recordAttempt(word: string, score: number): WordHistory {
  const all = readAll();
  const key = storageKey(word);
  const prev = all[key];
  const next: WordHistory = {
    best: prev ? Math.max(prev.best, score) : score,
    attempts: prev ? prev.attempts + 1 : 1,
    lastScore: score,
    lastAt: new Date().toISOString(),
  };
  all[key] = next;
  writeAll(all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<WordHistory>(eventName(word), { detail: next }));
  }
  return next;
}

// Notifies callers in the same tab when `word`'s history changes (e.g. the
// recorder just logged a new attempt) so a sibling component can refresh
// without prop drilling or a shared store.
export function subscribeToWordHistory(word: string, onChange: (history: WordHistory) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => onChange((e as CustomEvent<WordHistory>).detail);
  window.addEventListener(eventName(word), handler);
  return () => window.removeEventListener(eventName(word), handler);
}
