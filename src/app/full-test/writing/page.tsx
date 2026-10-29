import { getWritingQuestions, resolveWritingImageUrls } from "@/lib/data/writingQuestions";
import FullTestWritingClient from "@/components/full-test/FullTestWritingClient";

export default async function FullTestWritingPage() {
  const allQuestions = await getWritingQuestions();
  const questions = await resolveWritingImageUrls(allQuestions.filter((q) => q.order_index < 100));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Full Test Writing</h1>
      </div>
      <FullTestWritingClient questions={questions} />
    </div>
  );
}
