import { createClient } from "@/lib/supabase/server";
import type { WritingAttempt, WritingQuestion } from "@/types/database";

export type WritingAttemptWithQuestion = WritingAttempt & {
  writing_questions: Pick<WritingQuestion, "part" | "group_label" | "order_index" | "prompt_text">;
};

export async function getWritingAttempts(): Promise<WritingAttemptWithQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_attempts")
    .select("*, writing_questions(part, group_label, order_index, prompt_text)")
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data as unknown as WritingAttemptWithQuestion[];
}

export async function getAttemptedWritingQuestionIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("writing_attempts").select("question_id");

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.question_id as string));
}
