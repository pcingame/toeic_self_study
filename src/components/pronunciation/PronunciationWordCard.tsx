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
    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-zinc-100">{word}</span>
        <button
          onClick={play}
          className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950"
        >
          ▶ Nghe
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        {status === "loading" && "Đang tra phiên âm..."}
        {status === "found" && (phonetic ?? "(không có phiên âm)")}
        {status === "not-found" && "(không tìm thấy trong từ điển, dùng audio tổng hợp)"}
      </p>
      {tips.length > 0 && (
        <ul className="space-y-1">
          {tips.map((tip) => (
            <li
              key={tip}
              className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            >
              {tip}
            </li>
          ))}
        </ul>
      )}
      <PronunciationRecorder word={word} />
    </div>
  );
}
