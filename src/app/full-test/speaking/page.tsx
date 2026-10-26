import { getSpeakingQuestions } from "@/lib/data/speakingQuestions";
import FullTestSpeakingClient from "@/components/full-test/FullTestSpeakingClient";

export default async function FullTestSpeakingPage() {
  const questions = await getSpeakingQuestions();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Full Test Speaking</h1>
      </div>
      <FullTestSpeakingClient questions={questions} />
    </div>
  );
}
