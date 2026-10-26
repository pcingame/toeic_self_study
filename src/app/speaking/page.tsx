import Link from "next/link";
import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";
import { formatClock } from "@/lib/examTiming";

const PART_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: "Part 1 — Đọc to đoạn văn", description: "2 câu, chuẩn bị 45s, nói 45s" },
  2: { title: "Part 2 — Mô tả tranh", description: "1 câu, chuẩn bị 30s, nói 45s" },
  3: { title: "Part 3 — Trả lời câu hỏi khảo sát", description: "3 câu, không chuẩn bị" },
  4: { title: "Part 4 — Trả lời dựa trên thông tin cho sẵn", description: "3 câu, chuẩn bị 45s cho cả nhóm" },
  5: { title: "Part 5 — Đề xuất giải pháp / Nêu ý kiến", description: "2 câu" },
};

export default async function SpeakingListPage() {
  const questions = await getSpeakingQuestions();
  const byPart = [1, 2, 3, 4, 5].map((part) => ({
    part,
    items: questions.filter((q) => q.part === part),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Luyện Speaking</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Chọn một câu để luyện tập riêng lẻ. Cần quyền truy cập micro.</p>
      </div>

      {byPart.map(({ part, items }) => (
        <section key={part} className="space-y-3">
          <div>
            <h2 className="font-medium">{PART_LABELS[part].title}</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">{PART_LABELS[part].description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((q) => (
              <Link
                key={q.id}
                href={`/speaking/${q.part}/${q.id}`}
                className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 dark:text-zinc-500">
                    Câu {q.order_index} · {q.group_label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-zinc-500">
                    {q.prep_time_sec > 0 && `chuẩn bị ${formatClock(q.prep_time_sec)} · `}
                    nói {formatClock(q.speak_time_sec)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-700 dark:text-zinc-300">{q.prompt_text}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
