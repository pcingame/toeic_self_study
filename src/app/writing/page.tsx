import Link from "next/link";
import { getWritingQuestions } from "@/lib/data/writingQuestions";
import { formatClock } from "@/lib/examTiming";

const PART_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: "Part 1 — Viết câu từ tranh", description: "5 câu, mỗi câu dùng 2 từ/cụm từ cho trước" },
  2: { title: "Part 2 — Trả lời email", description: "2 câu, 10 phút mỗi câu" },
  3: { title: "Part 3 — Luận nêu ý kiến", description: "1 câu, 30 phút" },
};

export default async function WritingListPage() {
  const questions = await getWritingQuestions();

  const byPart = [1, 2, 3].map((part) => ({
    part,
    items: questions.filter((q) => q.part === part),
  }));

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="h1-page">Luyện Writing</h1>
        <p className="mt-1 text-sm text-muted">Chọn một câu để luyện tập riêng lẻ.</p>
      </div>

      {byPart.map(({ part, items }) => (
        <section key={part} className="space-y-3">
          <div>
            <h2 className="font-medium">{PART_LABELS[part].title}</h2>
            <p className="text-sm text-muted">{PART_LABELS[part].description}</p>
          </div>
          <div className="stagger grid gap-3 sm:grid-cols-2">
            {items.map((q) => (
              <Link key={q.id} href={`/writing/${q.part}/${q.id}`} className="card-link p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    Câu {q.order_index} · {q.group_label}
                  </span>
                  <span className="text-xs text-muted">{formatClock(q.time_limit_sec)}</span>
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
