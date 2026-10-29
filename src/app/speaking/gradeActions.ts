"use server";

import { createClient } from "@/lib/supabase/server";
import { gradeAnswer } from "@/lib/grading";
import type { GradeResult } from "@/types/database";

export async function gradeSpeakingAttempt(attemptId: string, transcript: string): Promise<GradeResult | null> {
  const supabase = await createClient();

  const { data: attempt, error } = await supabase
    .from("speaking_attempts")
    .select("speaking_questions(part, group_label, prompt_text)")
    .eq("id", attemptId)
    .single();
  if (error) throw error;

  const question = attempt.speaking_questions as unknown as {
    part: number;
    group_label: string;
    prompt_text: string;
  };

  const trimmed = transcript.trim();
  if (!trimmed) {
    await supabase
      .from("speaking_attempts")
      .update({ transcript: null, graded_at: new Date().toISOString() })
      .eq("id", attemptId);
    return null;
  }

  const graded = await gradeAnswer({
    examType: "speaking",
    part: question.part,
    groupLabel: question.group_label,
    promptText: question.prompt_text,
    context: null,
    answerText: trimmed,
  });

  const { error: updateError } = await supabase
    .from("speaking_attempts")
    .update({
      transcript: trimmed,
      score: graded.score,
      max_score: graded.maxScore,
      feedback: `${graded.strengths}\n\n${graded.improvements}`,
      graded_at: new Date().toISOString(),
    })
    .eq("id", attemptId);
  if (updateError) throw updateError;

  return graded;
}
