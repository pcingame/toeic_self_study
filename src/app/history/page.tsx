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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Lịch sử luyện tập</h1>
        <p className="text-sm text-gray-500">Xem lại các bài làm đã lưu.</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium">Writing</h2>
        {writingAttempts.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có bài Writing nào được lưu.</p>
        )}
        <div className="space-y-3">
          {writingAttempts.map((attempt) => (
            <div key={attempt.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                  Part {attempt.writing_questions.part} · {attempt.writing_questions.group_label} ·
                  Câu {attempt.writing_questions.order_index}
                </span>
                <span>
                  {formatDate(attempt.started_at)}
                  {attempt.duration_sec != null && ` · dùng ${formatClock(attempt.duration_sec)}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 italic">{attempt.writing_questions.prompt_text}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">
                {attempt.answer_text || <span className="text-gray-400">(không có nội dung)</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Speaking</h2>
        {speakingAttempts.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có bài Speaking nào được lưu.</p>
        )}
        <div className="space-y-3">
          {speakingAttempts.map((attempt) => (
            <div key={attempt.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                  Part {attempt.speaking_questions.part} · {attempt.speaking_questions.group_label} ·
                  Câu {attempt.speaking_questions.order_index}
                </span>
                <span>
                  {formatDate(attempt.started_at)}
                  {attempt.duration_sec != null && ` · ${formatClock(attempt.duration_sec)}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 italic">{attempt.speaking_questions.prompt_text}</p>
              {attempt.audioUrl ? (
                <audio controls src={attempt.audioUrl} className="mt-2 w-full" />
              ) : (
                <p className="mt-2 text-sm text-gray-400">(không có file ghi âm)</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
