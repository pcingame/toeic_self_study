import { createClient } from "@/lib/supabase/server";
import type { WritingQuestion } from "@/types/database";

export async function getWritingQuestions(): Promise<WritingQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as WritingQuestion[];
}

export async function getWritingQuestionById(id: string): Promise<WritingQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as WritingQuestion | null;
}

export function getNextWritingQuestion(
  all: WritingQuestion[],
  current: WritingQuestion,
): WritingQuestion | null {
  const sorted = [...all].sort((a, b) => a.order_index - b.order_index);
  const idx = sorted.findIndex((q) => q.id === current.id);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
}
