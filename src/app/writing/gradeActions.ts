"use server";

import { createClient } from "@/lib/supabase/server";
import { gradeAnswer } from "@/lib/grading";
import type { GradeResult } from "@/types/database";

export async function gradeWritingAttempt(attemptId: string): Promise<GradeResult> {
  const supabase = await createClient();

  const { data: attempt, error } = await supabase
    .from("writing_attempts")
    .select("answer_text, writing_questions(part, group_label, prompt_text, context)")
    .eq("id", attemptId)
    .single();
  if (error) throw error;

  const question = attempt.writing_questions as unknown as {
    part: number;
    group_label: string;
    prompt_text: string;
    context: string | null;
  };

  if (!attempt.answer_text.trim()) {
    const empty: GradeResult = {
      score: 0,
      maxScore: question.part === 2 ? 4 : question.part === 3 ? 5 : 3,
      strengths: "",
      improvements: "Bạn chưa nhập bài làm nên không có gì để chấm.",
    };
    await supabase
      .from("writing_attempts")
      .update({
        score: empty.score,
        max_score: empty.maxScore,
        feedback: empty.improvements,
        graded_at: new Date().toISOString(),
      })
      .eq("id", attemptId);
    return empty;
  }

  const graded = await gradeAnswer({
    examType: "writing",
    part: question.part,
    groupLabel: question.group_label,
    promptText: question.prompt_text,
    context: question.context,
    answerText: attempt.answer_text,
  });

  const { error: updateError } = await supabase
    .from("writing_attempts")
    .update({
      score: graded.score,
      max_score: graded.maxScore,
      feedback: `${graded.strengths}\n\n${graded.improvements}`,
      graded_at: new Date().toISOString(),
    })
    .eq("id", attemptId);
  if (updateError) throw updateError;

  return graded;
}
