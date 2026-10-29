import { notFound } from "next/navigation";
import Link from "next/link";
import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";
import FullTestSpeakingClient from "@/components/full-test/FullTestSpeakingClient";

const PART_TITLES: Record<number, string> = {
  1: "Part 1 — Đọc to đoạn văn",
  2: "Part 2 — Mô tả tranh",
  3: "Part 3 — Trả lời câu hỏi khảo sát",
  4: "Part 4 — Trả lời dựa trên thông tin cho sẵn",
  5: "Part 5 — Đề xuất giải pháp / Nêu ý kiến",
};

export default async function FullTestSpeakingPartPage({ params }: { params: Promise<{ part: string }> }) {
  const { part: partParam } = await params;
  const part = Number(partParam);
  if (!Number.isInteger(part) || part < 1 || part > 5) notFound();

  const allQuestions = await getSpeakingQuestions();
  const questions = allQuestions.filter((q) => q.part === part && q.order_index < 100);
  if (questions.length === 0) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{PART_TITLES[part]}</h1>
        <Link href="/full-test/speaking/by-part" className="link-muted shrink-0">
          ← Chọn Part khác
        </Link>
      </div>
      <FullTestSpeakingClient questions={questions} testLabel={PART_TITLES[part]} />
    </div>
  );
}
