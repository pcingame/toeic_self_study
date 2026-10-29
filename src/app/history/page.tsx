import { getWritingAttempts } from "@/lib/data/writingAttempts";
import { getSpeakingAttempts } from "@/lib/data/speakingAttempts";
import { formatClock } from "@/lib/examTiming";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

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

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Writing</h2>
        {writingAttempts.length === 0 && <p className="text-sm text-muted">Chưa có bài Writing nào được lưu.</p>}
        <div className="stagger space-y-3">
          {writingAttempts.map((attempt) => (
            <div key={attempt.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>
                  Part {attempt.writing_questions.part} · {attempt.writing_questions.group_label} ·
                  Câu {attempt.writing_questions.order_index}
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
                  {attempt.feedback && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{attempt.feedback}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium">Speaking</h2>
        {speakingAttempts.length === 0 && <p className="text-sm text-muted">Chưa có bài Speaking nào được lưu.</p>}
        <div className="stagger space-y-3">
          {speakingAttempts.map((attempt) => (
            <div key={attempt.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>
                  Part {attempt.speaking_questions.part} · {attempt.speaking_questions.group_label} ·
                  Câu {attempt.speaking_questions.order_index}
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
                  {attempt.feedback && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{attempt.feedback}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
