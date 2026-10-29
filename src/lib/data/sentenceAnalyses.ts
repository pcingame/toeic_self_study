import { createClient } from "@/lib/supabase/server";
import type { SentenceAnalysis } from "@/types/database";

export async function getSentenceAnalyses(): Promise<SentenceAnalysis[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sentence_analyses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as SentenceAnalysis[];
}

export async function getSentenceAnalysisById(id: string): Promise<SentenceAnalysis | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sentence_analyses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as SentenceAnalysis | null;
}
