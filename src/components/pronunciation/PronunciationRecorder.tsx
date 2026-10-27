"use client";

import { useEffect, useRef, useState } from "react";
import WaveformBars from "@/components/WaveformBars";
import { getTipsForWord } from "@/lib/pronunciationTips";
import { getWordHistory, recordAttempt, subscribeToWordHistory, type WordHistory } from "@/lib/pronunciationHistory";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence?: number;
}
interface SpeechRecognitionResultLike {
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [index: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  maxAlternatives: number;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type RecState = "idle" | "recording" | "done";

interface ScoreResult {
  score: number;
  heard: string;
}

// Messages for SpeechRecognition's error codes. "aborted" is left out --
// that fires on every user-initiated stop() and isn't a real failure.
const RECOGNITION_ERROR_MESSAGES: Record<string, string> = {
  "no-speech": "Không nghe thấy gì, hãy thử lại.",
  "audio-capture": "Không tìm thấy micro. Hãy kiểm tra thiết bị ghi âm.",
  "not-allowed": "Trình duyệt chặn quyền truy cập micro. Hãy cấp quyền rồi thử lại.",
  "service-not-allowed": "Trình duyệt chặn quyền truy cập micro. Hãy cấp quyền rồi thử lại.",
  network: "Lỗi mạng khi nhận diện giọng nói (cần kết nối Internet). Bản ghi âm vẫn được lưu để bạn nghe lại.",
};

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z' ]/g, "");
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Similarity of one heard phrase against the target word, 0-100. Checks the
// whole phrase and each individual word in it (recognizers often tack on
// filler words around a short target), keeping the closest match.
function wordSimilarity(target: string, heard: string): number {
  const t = normalize(target);
  const h = normalize(heard);
  if (!t || !h) return 0;
  if (t === h) return 100;

  const candidates = [h, ...h.split(/\s+/)];
  let best = 0;
  for (const c of candidates) {
    if (!c) continue;
    const dist = levenshtein(t, c);
    const maxLen = Math.max(t.length, c.length);
    const sim = maxLen === 0 ? 0 : Math.round((1 - dist / maxLen) * 100);
    if (sim > best) best = sim;
  }
  return Math.max(0, Math.min(100, best));
}

// Re-scores every alternative the recognizer offered and keeps the best
// match. A low-confidence-but-accurate alternative often ranks below a
// confident-but-wrong one, so re-ranking by text similarity to the target
// is more reliable here than trusting the recognizer's own top pick.
function scoreAlternatives(target: string, alternatives: SpeechRecognitionAlternativeLike[]): ScoreResult {
  let best: ScoreResult = { score: 0, heard: alternatives[0]?.transcript ?? "" };
  for (const alt of alternatives) {
    const score = wordSimilarity(target, alt.transcript);
    if (score > best.score) best = { score, heard: alt.transcript };
  }
  return best;
}

interface Tier {
  label: string;
  emoji: string;
  textClass: string;
  barClass: string;
}

function tierFor(score: number): Tier {
  if (score >= 90) {
    return { label: "Xuất sắc", emoji: "🌟", textClass: "text-green-700 dark:text-green-400", barClass: "bg-green-600 dark:bg-green-400" };
  }
  if (score >= 70) {
    return { label: "Tốt", emoji: "✅", textClass: "text-green-700 dark:text-green-400", barClass: "bg-green-600 dark:bg-green-400" };
  }
  if (score >= 45) {
    return { label: "Tạm được — luyện thêm", emoji: "⚠️", textClass: "text-highlight", barClass: "bg-[var(--color-highlight)]" };
  }
  return { label: "Chưa đúng — thử lại", emoji: "❌", textClass: "text-error", barClass: "bg-red-500 dark:bg-red-400" };
}

export default function PronunciationRecorder({ word }: { word: string }) {
  const [recState, setRecState] = useState<RecState>("idle");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<WordHistory | null>(null);
  // Starts true so server and client render the same markup on mount; corrected
  // right after hydration once `window` is actually available to check.
  const [speechSupported, setSpeechSupported] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    setHistory(getWordHistory(word));
    return subscribeToWordHistory(word, setHistory);
  }, [word]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    try {
      recognitionRef.current?.stop();
    } catch {
      // already stopped
    }
    setRecState("done");
  }

  async function start() {
    if (recState === "recording") return;

    setError(null);
    setResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Không thể truy cập micro. Hãy kiểm tra quyền truy cập micro cho trang web này.");
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    const mimeType = pickMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    recorder.start();
    setRecState("recording");

    // Speech recognition is a separate, best-effort layer on top of the
    // recording itself: if it fails to start (already running elsewhere,
    // offline, etc.) the raw recording still proceeds and stays usable.
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;

    try {
      const recognition = new Ctor();
      recognition.lang = "en-US";
      // Ask for several guesses and re-rank them ourselves -- a single
      // top guess is too brittle for grading short, isolated words.
      recognition.maxAlternatives = 5;
      recognition.interimResults = false;
      recognition.onresult = (e) => {
        const resultList = e.results[0];
        const alternatives: SpeechRecognitionAlternativeLike[] = [];
        for (let i = 0; i < (resultList?.length ?? 0); i++) {
          alternatives.push(resultList[i]);
        }
        const scored = scoreAlternatives(word, alternatives);
        setResult(scored);
        setHistory(recordAttempt(word, scored.score));
      };
      recognition.onerror = (e) => {
        const message = RECOGNITION_ERROR_MESSAGES[e.error];
        if (message) setError(message);
      };
      recognition.onend = () => stop();
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setError("Không khởi động được nhận diện giọng nói, nhưng bản ghi âm vẫn tiếp tục.");
    }
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setResult(null);
    setError(null);
    setRecState("idle");
  }

  const tier = result ? tierFor(result.score) : null;
  const tips = getTipsForWord(word);

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-[var(--color-border)] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">
          Luyện phát âm
          {history && (
            <span className="ml-2 text-[var(--color-primary)]">
              🏆 {history.best}/100 · đã luyện {history.attempts} lần
            </span>
          )}
        </span>
        {recState === "recording" ? (
          <button onClick={stop} className="pill-rec flex shrink-0 items-center gap-2 px-3 py-1 text-xs">
            <WaveformBars active bars={4} className="h-3" />■ Dừng
          </button>
        ) : (
          <button
            onClick={start}
            className="shrink-0 rounded-xl bg-[var(--color-surface-2)] px-3 py-1 text-xs font-medium text-[var(--color-ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] hover:text-[var(--color-primary)]"
          >
            🎤 Ghi âm
          </button>
        )}
      </div>

      {!speechSupported && (
        <p className="text-highlight text-xs">
          Trình duyệt này không hỗ trợ nhận diện giọng nói — chỉ ghi âm để tự nghe lại, không chấm điểm được. Dùng
          Chrome để có tính năng này.
        </p>
      )}

      {error && <p className="text-error text-xs">{error}</p>}

      {recState === "recording" && (
        <p className="text-xs text-[var(--color-accent)]">● Đang nghe, hãy đọc từ &quot;{word}&quot;...</p>
      )}

      {recState === "done" && (
        <div className="space-y-2">
          {audioUrl && <audio controls src={audioUrl} className="w-full" />}

          {result && tier && (
            <div className={`animate-pop space-y-1.5 ${result.score < 45 ? "animate-shake" : ""}`}>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={tier.textClass}>
                  {tier.emoji} {tier.label}
                </span>
                <span className={tier.textClass}>{result.score}/100</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${tier.barClass}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <p className="text-xs text-muted">Máy nghe được: &quot;{result.heard || "(không rõ)"}&quot;</p>
              {result.score < 70 && tips.length > 0 && <p className="tip-highlight">{tips[0]}</p>}
            </div>
          )}

          <button onClick={reset} className="btn-ghost px-3 py-1 text-xs">
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}
