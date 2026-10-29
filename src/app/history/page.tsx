import { getWritingAttempts } from "@/lib/data/writingAttempts";
import { getSpeakingAttempts } from "@/lib/data/speakingAttempts";
import { WritingHistorySection, SpeakingHistorySection } from "@/components/history/HistorySections";

function ProgressBars({
  attempts,
  label,
}: {
  attempts: { started_at: string; score: number | null; max_score: number | null; graded_at: string | null }[];
  label: string;
}) {
  const graded = attempts
    .filter((a) => a.graded_at && a.score != null && a.max_score)
    .slice()
    .reverse(); // attempts arrive newest-first; show oldest -> newest left to right

  if (graded.length === 0) return null;

  const percents = graded.map((a) => Math.round((a.score! / a.max_score!) * 100));
  const avg = Math.round(percents.reduce((sum, p) => sum + p, 0) / percents.length);

  return (
    <div className="card space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-[var(--color-ink)]">Tiến độ {label}</span>
        <span className="text-muted">
          Trung bình {avg}% · {graded.length} bài đã chấm
        </span>
      </div>
      <div className="flex h-24 items-end gap-1">
        {graded.map((a, i) => (
          <div
            key={i}
            title={`${percents[i]}% · ${new Date(a.started_at).toLocaleDateString("vi-VN")}`}
            className="min-w-[4px] flex-1 rounded-t bg-[var(--color-primary)]/70"
            style={{ height: `${Math.max(percents[i], 4)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default async function HistoryPage() {
  const [writingAttempts, speakingAttempts] = await Promise.all([
    getWritingAttempts(),
    getSpeakingAttempts(),
  ]);

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="h1-page">Lịch sử luyện tập</h1>
        <p className="mt-1 text-sm text-muted">Xem lại các bài làm đã lưu.</p>
      </div>

      <div className="stagger grid gap-4 sm:grid-cols-2">
        <ProgressBars attempts={writingAttempts} label="Writing" />
        <ProgressBars attempts={speakingAttempts} label="Speaking" />
      </div>

      <WritingHistorySection attempts={writingAttempts} />
      <SpeakingHistorySection attempts={speakingAttempts} />
    </div>
  );
}
