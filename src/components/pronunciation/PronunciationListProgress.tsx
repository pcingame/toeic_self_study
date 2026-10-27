"use client";

import { useEffect, useState } from "react";
import { getWordHistory, subscribeToWordHistory, MASTERY_THRESHOLD } from "@/lib/pronunciationHistory";

function countMastered(words: string[]): number {
  return words.filter((w) => (getWordHistory(w)?.best ?? 0) >= MASTERY_THRESHOLD).length;
}

export default function PronunciationListProgress({ words }: { words: string[] }) {
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMastered(countMastered(words));
    const unsubscribers = words.map((w) => subscribeToWordHistory(w, () => setMastered(countMastered(words))));
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [words]);

  const total = words.length;
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100);

  return (
    <div className="card space-y-1.5 p-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Tiến độ</span>
        <span className="text-[var(--color-primary)]">
          {mastered}/{total} từ đã đạt ≥{MASTERY_THRESHOLD} điểm
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
