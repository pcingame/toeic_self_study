"use client";

import { useEffect, useState } from "react";
import { getAllWordHistory, MASTERY_THRESHOLD } from "@/lib/pronunciationHistory";
import PronunciationWordCard from "./PronunciationWordCard";

const MAX_SHOWN = 12;

export default function WeakWordsReview() {
  const [words, setWords] = useState<string[] | null>(null);

  useEffect(() => {
    const all = getAllWordHistory();
    const weak = Object.entries(all)
      .filter(([, h]) => h.best < MASTERY_THRESHOLD)
      .sort((a, b) => a[1].best - b[1].best)
      .slice(0, MAX_SHOWN)
      .map(([word]) => word);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWords(weak);
  }, []);

  if (!words || words.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg font-medium">Từ cần ôn lại</h2>
        <p className="text-sm text-muted">
          Các từ bạn đã ghi âm nhưng điểm chưa đạt ≥{MASTERY_THRESHOLD}, xếp theo điểm thấp nhất trước.
        </p>
      </div>
      <div className="stagger grid gap-3 sm:grid-cols-2">
        {words.map((w) => (
          <PronunciationWordCard key={w} word={w} />
        ))}
      </div>
    </section>
  );
}
