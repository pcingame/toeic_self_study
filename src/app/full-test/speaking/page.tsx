import Link from "next/link";
import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";
import FullTestSpeakingClient from "@/components/full-test/FullTestSpeakingClient";

export default async function FullTestSpeakingPage() {
  const allQuestions = await getSpeakingQuestions();
  const questions = allQuestions.filter((q) => q.order_index < 100);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Full Test Speaking</h1>
        <Link href="/full-test/speaking/by-part" className="link-muted shrink-0">
          Kiểm tra từng Part →
        </Link>
      </div>
      <FullTestSpeakingClient questions={questions} />
    </div>
  );
}
