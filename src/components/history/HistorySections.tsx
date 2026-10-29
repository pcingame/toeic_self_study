"use client";

import { useState } from "react";
import { formatClock } from "@/lib/examTiming";
import type { WritingAttemptWithQuestion } from "@/lib/data/writingAttempts";
import type { SpeakingAttemptWithQuestion } from "@/lib/data/speakingAttempts";

const PAGE_SIZE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

function useAttemptFilter<T extends { graded_at: string | null }>(attempts: T[], part: (a: T) => number) {
  const [partFilter, setPartFilter] = useState<number | "all">("all");
  const [gradedOnly, setGradedOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const parts = Array.from(new Set(attempts.map(part))).sort((a, b) => a - b);
  const filtered = attempts.filter((a) => {
    if (partFilter !== "all" && part(a) !== partFilter) return false;
    if (gradedOnly && !a.graded_at) return false;
    return true;
  });

  function resetVisible() {
    setVisible(PAGE_SIZE);
  }

  return {
    parts,
    partFilter,
    setPartFilter: (v: number | "all") => {
      setPartFilter(v);
      resetVisible();
    },
    gradedOnly,
    setGradedOnly: (v: boolean) => {
      setGradedOnly(v);
      resetVisible();
    },
    filtered,
    shown: filtered.slice(0, visible),
    visible,
    showMore: () => setVisible((v) => v + PAGE_SIZE),
  };
}

function FilterBar({
  parts,
  partFilter,
  setPartFilter,
  gradedOnly,
  setGradedOnly,
}: {
  parts: number[];
  partFilter: number | "all";
  setPartFilter: (v: number | "all") => void;
  gradedOnly: boolean;
  setGradedOnly: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <select
        value={partFilter}
        onChange={(e) => setPartFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
        className="input-field w-auto py-1.5"
      >
        <option value="all">Tất cả Part</option>
        {parts.map((p) => (
          <option key={p} value={p}>
            Part {p}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1.5 text-muted">
        <input type="checkbox" checked={gradedOnly} onChange={(e) => setGradedOnly(e.target.checked)} />
        Chỉ xem đã chấm
      </label>
    </div>
  );
}

export function WritingHistorySection({ attempts }: { attempts: WritingAttemptWithQuestion[] }) {
  const f = useAttemptFilter(attempts, (a) => a.writing_questions.part);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-medium">Writing</h2>
        {attempts.length > 0 && <FilterBar {...f} />}
      </div>
      {attempts.length === 0 && <p className="text-sm text-muted">Chưa có bài Writing nào được lưu.</p>}
      {attempts.length > 0 && f.filtered.length === 0 && (
        <p className="text-sm text-muted">Không có bài nào khớp bộ lọc.</p>
      )}
      <div className="stagger space-y-3">
        {f.shown.map((attempt) => (
          <div key={attempt.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span>
                Part {attempt.writing_questions.part} · {attempt.writing_questions.group_label} · Câu{" "}
                {attempt.writing_questions.order_index}
              </span>
              <span>
                {formatDate(attempt.started_at)}
                {attempt.duration_sec != null && ` · dùng ${formatClock(attempt.duration_sec)}`}
              </span>
            </div>
            <p className="mt-2 text-sm italic text-muted">{attempt.writing_questions.prompt_text}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink)]">
              {attempt.answer_text || <span className="text-muted">(không có nội dung)</span>}
            </p>
            {attempt.graded_at && (
              <div className="mt-2 rounded-xl bg-[var(--color-surface-2)] p-3">
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {attempt.score}/{attempt.max_score} điểm (AI chấm)
                </p>
                {attempt.feedback && <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{attempt.feedback}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      {f.visible < f.filtered.length && (
        <button onClick={f.showMore} className="btn-ghost">
          Xem thêm ({f.filtered.length - f.visible} bài)
        </button>
      )}
    </section>
  );
}

export function SpeakingHistorySection({ attempts }: { attempts: SpeakingAttemptWithQuestion[] }) {
  const f = useAttemptFilter(attempts, (a) => a.speaking_questions.part);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-medium">Speaking</h2>
        {attempts.length > 0 && <FilterBar {...f} />}
      </div>
      {attempts.length === 0 && <p className="text-sm text-muted">Chưa có bài Speaking nào được lưu.</p>}
      {attempts.length > 0 && f.filtered.length === 0 && (
        <p className="text-sm text-muted">Không có bài nào khớp bộ lọc.</p>
      )}
      <div className="stagger space-y-3">
        {f.shown.map((attempt) => (
          <div key={attempt.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span>
                Part {attempt.speaking_questions.part} · {attempt.speaking_questions.group_label} · Câu{" "}
                {attempt.speaking_questions.order_index}
              </span>
              <span>
                {formatDate(attempt.started_at)}
                {attempt.duration_sec != null && ` · ${formatClock(attempt.duration_sec)}`}
              </span>
            </div>
            <p className="mt-2 text-sm italic text-muted">{attempt.speaking_questions.prompt_text}</p>
            {attempt.audioUrl ? (
              <audio controls src={attempt.audioUrl} className="mt-2 w-full" />
            ) : (
              <p className="mt-2 text-sm text-muted">(không có file ghi âm)</p>
            )}
            {attempt.graded_at && attempt.score != null && (
              <div className="mt-2 rounded-xl bg-[var(--color-surface-2)] p-3">
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {attempt.score}/{attempt.max_score} điểm (AI chấm, dựa trên transcript)
                </p>
                {attempt.feedback && <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{attempt.feedback}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      {f.visible < f.filtered.length && (
        <button onClick={f.showMore} className="btn-ghost">
          Xem thêm ({f.filtered.length - f.visible} bài)
        </button>
      )}
    </section>
  );
}
