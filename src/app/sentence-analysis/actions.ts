"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { analyzeSentence } from "@/lib/sentenceAnalysis";

export async function createSentenceAnalysis(sentence: string): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed) throw new Error("Câu đang trống");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const result = await analyzeSentence(trimmed);

  const { data, error } = await supabase
    .from("sentence_analyses")
    .insert({
      user_id: userData.user.id,
      sentence: trimmed,
      translation: result.translation,
      ipa_us: result.ipaUS,
      ipa_uk: result.ipaUK,
      vietnamese_approx: result.vietnameseApprox,
      note: result.note,
      words: result.words,
      clauses: result.clauses,
      structure_pattern: result.structurePattern,
      structure_legend: result.structureLegend,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/sentence-analysis");
  return data.id as string;
}

export async function deleteSentenceAnalysis(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("sentence_analyses").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/sentence-analysis");
}
