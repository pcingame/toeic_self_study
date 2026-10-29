import Link from "next/link";
import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";

const PART_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: "Part 1 — Đọc to đoạn văn", description: "2 câu, chuẩn bị 45s, nói 45s" },
  2: { title: "Part 2 — Mô tả tranh", description: "1 câu, chuẩn bị 30s, nói 45s" },
  3: { title: "Part 3 — Trả lời câu hỏi khảo sát", description: "3 câu, không chuẩn bị" },
  4: { title: "Part 4 — Trả lời dựa trên thông tin cho sẵn", description: "3 câu, chuẩn bị 45s cho cả nhóm" },
  5: { title: "Part 5 — Đề xuất giải pháp / Nêu ý kiến", description: "2 câu" },
};

export default async function FullTestSpeakingByPartPage() {
  const allQuestions = await getSpeakingQuestions();
  const official = allQuestions.filter((q) => q.order_index < 100);
  const counts = [1, 2, 3, 4, 5].map((part) => ({
    part,
    count: official.filter((q) => q.part === part).length,
  }));

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="h1-page">Kiểm tra Speaking theo Part</h1>
        <p className="mt-1 text-sm text-muted">
          Chọn một Part để làm liên tục đúng thời gian thi, không cần làm hết cả 11 câu.
        </p>
      </div>
      <div className="stagger grid gap-4 sm:grid-cols-2">
        {counts.map(({ part, count }) => (
          <Link
            key={part}
            href={count > 0 ? `/full-test/speaking/by-part/${part}` : "#"}
            aria-disabled={count === 0}
            className={count > 0 ? "card-link p-5" : "card p-5 opacity-50"}
          >
            <h2 className="font-medium">{PART_LABELS[part].title}</h2>
            <p className="mt-1 text-sm text-muted">{PART_LABELS[part].description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
