// Phonetic transcription lookup with a fallback chain:
//   1. dictionaryapi.dev -- curated IPA + pronunciation audio, but spotty
//      coverage for business/TOEIC vocabulary and occasionally flaky (502s).
//   2. Datamuse -- near-universal English coverage, no audio, returns
//      ARPAbet (e.g. "K W AO1 R T ER0 L IY0") instead of IPA, converted below.

export interface PhoneticResult {
  phonetic: string | null;
  audio: string | null;
  /** Marks IPA that we derived from ARPAbet rather than got from a curated source. */
  estimated: boolean;
}

interface DictionaryEntry {
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
}

interface DatamuseEntry {
  word: string;
  tags?: string[];
}

// dictionaryapi.dev sometimes returns protocol-relative audio URLs
// (e.g. "//ssl.gstatic.com/..."), which some browsers refuse to load
// via `new Audio()` without an explicit scheme.
function normalizeAudioUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

async function fetchDictionaryApi(word: string): Promise<{ phonetic: string | null; audio: string | null }> {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error(`dictionaryapi.dev ${res.status}`);
  const entries = (await res.json()) as DictionaryEntry[];

  const withAudio = entries.flatMap((e) => e.phonetics ?? []).find((p) => p.audio);
  const phonetic =
    entries.find((e) => e.phonetic)?.phonetic ??
    entries.flatMap((e) => e.phonetics ?? []).find((p) => p.text)?.text ??
    null;

  return { phonetic, audio: withAudio?.audio ? normalizeAudioUrl(withAudio.audio) : null };
}

// ARPAbet -> IPA, stripped of stress digits.
const ARPABET_TO_IPA: Record<string, string> = {
  // Consonants
  P: "p", B: "b", T: "t", D: "d", K: "k", G: "ɡ",
  CH: "tʃ", JH: "dʒ", F: "f", V: "v", TH: "θ", DH: "ð",
  S: "s", Z: "z", SH: "ʃ", ZH: "ʒ", HH: "h",
  M: "m", N: "n", NG: "ŋ", L: "l", R: "r", Y: "j", W: "w",
  // Vowels (AH/AH0 handled specially below for the schwa case)
  AA: "ɑ", AE: "æ", AH: "ʌ", AO: "ɔ", AW: "aʊ", AY: "aɪ",
  EH: "ɛ", ER: "ɝ", EY: "eɪ", IH: "ɪ", IY: "i",
  OW: "oʊ", OY: "ɔɪ", UH: "ʊ", UW: "u",
};

// Converts a Datamuse "pron:" tag (ARPAbet, space-separated, stress digits on
// vowels) into an approximate IPA string. Good enough as a self-study hint.
// The primary-stress mark is placed before the full onset consonant cluster
// of the stressed syllable (maximal-onset heuristic), matching how it's
// normally written -- "quarterly" -> "ˈkwɔrtɚli", not "kwˈɔrtɚli". Monosyllabic
// words skip the mark entirely, as most dictionaries do.
function arpabetToIpa(pron: string): string {
  const phones = pron.trim().split(/\s+/);
  const symbols: string[] = [];
  const isVowel: boolean[] = [];
  let stressIndex = -1;
  let vowelCount = 0;

  for (const phone of phones) {
    const match = /^([A-Z]+)([0-2])?$/.exec(phone);
    if (!match) continue;
    const [, base, stress] = match;

    let symbol = ARPABET_TO_IPA[base];
    if (!symbol) continue;

    const vowel = stress !== undefined;
    if (vowel) vowelCount++;
    if (base === "AH" && stress === "0") symbol = "ə";
    if (base === "ER" && stress === "0") symbol = "ɚ";
    if (vowel && stress === "1" && stressIndex === -1) stressIndex = symbols.length;

    symbols.push(symbol);
    isVowel.push(vowel);
  }

  if (stressIndex === -1 || vowelCount <= 1) return symbols.join("");

  let onsetStart = stressIndex;
  while (onsetStart > 0 && !isVowel[onsetStart - 1]) onsetStart--;

  return symbols.slice(0, onsetStart).join("") + "ˈ" + symbols.slice(onsetStart).join("");
}

async function fetchDatamuseIpa(word: string): Promise<string | null> {
  const res = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=r&max=1`);
  if (!res.ok) throw new Error(`datamuse ${res.status}`);
  const entries = (await res.json()) as DatamuseEntry[];

  const entry = entries.find((e) => e.word.toLowerCase() === word.toLowerCase());
  const pronTag = entry?.tags?.find((t) => t.startsWith("pron:"));
  if (!pronTag) return null;

  const ipa = arpabetToIpa(pronTag.slice("pron:".length));
  return ipa || null;
}

export async function lookupPhonetic(word: string): Promise<PhoneticResult> {
  const w = word.toLowerCase();
  let phonetic: string | null = null;
  let audio: string | null = null;

  try {
    const primary = await fetchDictionaryApi(w);
    phonetic = primary.phonetic;
    audio = primary.audio;
  } catch {
    // fall through to the secondary source below
  }

  if (phonetic) return { phonetic, audio, estimated: false };

  try {
    const estimated = await fetchDatamuseIpa(w);
    if (estimated) return { phonetic: estimated, audio, estimated: true };
  } catch {
    // both sources unavailable -- caller shows the "not found" state
  }

  return { phonetic: null, audio, estimated: false };
}
