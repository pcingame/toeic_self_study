import { notFound } from "next/navigation";
import {
  getNextWritingQuestion,
  getWritingQuestionById,
  getWritingQuestions,
} from "@/lib/data/writingQuestions";
import WritingPracticeClient from "@/components/writing/WritingPracticeClient";

export default async function WritingPracticePage({
  params,
}: {
  params: Promise<{ part: string; questionId: string }>;
}) {
  const { questionId } = await params;
  const question = await getWritingQuestionById(questionId);
  if (!question) notFound();

  const all = await getWritingQuestions();
  const next = getNextWritingQuestion(all, question);

  return (
    <WritingPracticeClient
      question={question}
      nextHref={next ? `/writing/${next.part}/${next.id}` : "/writing"}
    />
  );
}
