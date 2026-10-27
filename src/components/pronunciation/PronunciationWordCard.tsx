"use client";

import { useEffect, useState } from "react";
import { getTipsForWord } from "@/lib/pronunciationTips";
import PronunciationRecorder from "@/components/pronunciation/PronunciationRecorder";

interface DictionaryEntry {
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
}

export default function PronunciationWordCard({ word }: { word: string }) {
  const [phonetic, setPhonetic] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");

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
        setAudioUrl(withAudio?.audio || null);
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
    if (audioUrl) {
      new Audio(audioUrl).play().catch(() => fallbackSpeak());
    } else {
      fallbackSpeak();
    }
  }

  function fallbackSpeak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
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
