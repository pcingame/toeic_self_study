import { getWritingAttempts } from "@/lib/data/writingAttempts";
import { getSpeakingAttempts } from "@/lib/data/speakingAttempts";
import { formatClock } from "@/lib/examTiming";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
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
