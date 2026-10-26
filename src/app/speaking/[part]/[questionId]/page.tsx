import { notFound } from "next/navigation";
import {
  getNextSpeakingQuestion,
  getSpeakingQuestionById,
  getSpeakingQuestions,
} from "@/lib/data/speakingQuestions";
import SpeakingPracticeClient from "@/components/speaking/SpeakingPracticeClient";

export default async function SpeakingPracticePage({
  params,
}: {
  params: Promise<{ part: string; questionId: string }>;
}) {
  const { questionId } = await params;
  const question = await getSpeakingQuestionById(questionId);
  if (!question) notFound();

  const all = await getSpeakingQuestions();
  const next = getNextSpeakingQuestion(all, question);

  return (
    <SpeakingPracticeClient
      question={question}
      nextHref={next ? `/speaking/${next.part}/${next.id}` : "/speaking"}
    />
  );
}
