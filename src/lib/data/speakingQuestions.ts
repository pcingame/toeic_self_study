import { createClient } from "@/lib/supabase/server";
import type { SpeakingQuestion } from "@/types/database";

export async function getSpeakingQuestions(): Promise<SpeakingQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as SpeakingQuestion[];
}

export async function getSpeakingQuestionById(id: string): Promise<SpeakingQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as SpeakingQuestion | null;
}

export function getNextSpeakingQuestion(
  all: SpeakingQuestion[],
  current: SpeakingQuestion,
): SpeakingQuestion | null {
  const sorted = [...all].sort((a, b) => a.order_index - b.order_index);
  const idx = sorted.findIndex((q) => q.id === current.id);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
}
