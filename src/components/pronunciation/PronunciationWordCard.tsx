"use client";

import { useEffect, useState } from "react";
import { getTipsForWord } from "@/lib/pronunciationTips";
import PronunciationRecorder from "@/components/pronunciation/PronunciationRecorder";

interface DictionaryEntry {
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
}

// dictionaryapi.dev sometimes returns protocol-relative audio URLs
// (e.g. "//ssl.gstatic.com/..."), which some browsers refuse to load
// via `new Audio()` without an explicit scheme.
function normalizeAudioUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

// Chrome silently drops the very first speechSynthesis.speak() call if the
// voice list hasn't finished loading yet -- wait for it (with a timeout so
// we never hang forever on browsers that never fire the event).
function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timeout);
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

export default function PronunciationWordCard({ word }: { word: string }) {
  const [phonetic, setPhonetic] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [playError, setPlayError] = useState<string | null>(null);

  const tips = getTipsForWord(word);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
        );
        if (!res.ok) throw new Error("not found");
        const entries = (await res.json()) as DictionaryEntry[];
        if (cancelled) return;

        const withAudio = entries.flatMap((e) => e.phonetics ?? []).find((p) => p.audio);
        const anyPhonetic =
          entries.find((e) => e.phonetic)?.phonetic ??
          entries.flatMap((e) => e.phonetics ?? []).find((p) => p.text)?.text ??
          null;

        setPhonetic(anyPhonetic);
        setAudioUrl(withAudio?.audio ? normalizeAudioUrl(withAudio.audio) : null);
        setStatus("found");
      } catch {
        if (!cancelled) setStatus("not-found");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [word]);

  function play() {
    setPlayError(null);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener("error", () => void fallbackSpeak());
      audio.play().catch(() => void fallbackSpeak());
    } else {
      void fallbackSpeak();
    }
  }

  async function fallbackSpeak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlayError("Trình duyệt không hỗ trợ phát âm thanh cho từ này.");
      return;
    }

    // Clear any stuck queue from a previous click before speaking again.
    window.speechSynthesis.cancel();

    const voices = await waitForVoices();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    const enVoice = voices.find((v) => v.lang === "en-US") ?? voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    utterance.onerror = () => setPlayError("Không phát được âm thanh, hãy thử lại.");
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="card space-y-2 p-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-medium text-[var(--color-ink)]">{word}</span>
        <button
          onClick={play}
          className="rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-3 py-1 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        >
          ▶ Nghe
        </button>
      </div>
      <p className="text-sm text-muted">
        {status === "loading" && "Đang tra phiên âm..."}
        {status === "found" && (phonetic ?? "(không có phiên âm)")}
        {status === "not-found" && "(không tìm thấy trong từ điển, dùng audio tổng hợp)"}
      </p>
      {playError && <p className="text-error text-xs">{playError}</p>}
      {tips.length > 0 && (
        <ul className="space-y-1">
          {tips.map((tip) => (
            <li key={tip} className="tip-highlight">
              {tip}
            </li>
          ))}
        </ul>
      )}
      <PronunciationRecorder word={word} />
    </div>
  );
}
