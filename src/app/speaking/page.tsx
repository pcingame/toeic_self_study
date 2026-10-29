import Link from "next/link";
import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";
import { getAttemptedSpeakingQuestionIds } from "@/lib/data/speakingAttempts";
import { formatClock } from "@/lib/examTiming";

const PART_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: "Part 1 — Đọc to đoạn văn", description: "2 câu, chuẩn bị 45s, nói 45s" },
  2: { title: "Part 2 — Mô tả tranh", description: "1 câu, chuẩn bị 30s, nói 45s" },
  3: { title: "Part 3 — Trả lời câu hỏi khảo sát", description: "3 câu, không chuẩn bị" },
  4: { title: "Part 4 — Trả lời dựa trên thông tin cho sẵn", description: "3 câu, chuẩn bị 45s cho cả nhóm" },
  5: { title: "Part 5 — Đề xuất giải pháp / Nêu ý kiến", description: "2 câu" },
};

export default async function SpeakingListPage() {
  const [questions, attemptedIds] = await Promise.all([getSpeakingQuestions(), getAttemptedSpeakingQuestionIds()]);
  const byPart = [1, 2, 3, 4, 5].map((part) => ({
    part,
    items: questions.filter((q) => q.part === part),
  }));

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="h1-page">Luyện Speaking</h1>
        <p className="mt-1 text-sm text-muted">Chọn một câu để luyện tập riêng lẻ. Cần quyền truy cập micro.</p>
      </div>

      {byPart.map(({ part, items }) => (
        <section key={part} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-medium">{PART_LABELS[part].title}</h2>
              <p className="text-sm text-muted">{PART_LABELS[part].description}</p>
            </div>
            {part === 1 && (
              <Link href="/speaking/part1-guide" className="link-muted shrink-0">
                Hướng dẫn phát âm &amp; trọng âm →
              </Link>
            )}
          </div>
          <div className="stagger grid gap-3 sm:grid-cols-2">
            {items.map((q) => (
              <Link key={q.id} href={`/speaking/${q.part}/${q.id}`} className="card-link p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    Câu {q.order_index} · {q.group_label}
                    {attemptedIds.has(q.id) && (
                      <span className="ml-2 text-[var(--color-primary)]" title="Đã luyện câu này">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted">
                    {q.prep_time_sec > 0 && `chuẩn bị ${formatClock(q.prep_time_sec)} · `}
                    nói {formatClock(q.speak_time_sec)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-ink)]/80">{q.prompt_text}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
