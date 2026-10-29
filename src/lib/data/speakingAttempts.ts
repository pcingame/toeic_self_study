import { createClient } from "@/lib/supabase/server";
import type { SpeakingAttempt, SpeakingQuestion } from "@/types/database";

export type SpeakingAttemptWithQuestion = SpeakingAttempt & {
  speaking_questions: Pick<SpeakingQuestion, "part" | "group_label" | "order_index" | "prompt_text">;
  audioUrl: string | null;
};

const SIGNED_URL_TTL_SEC = 60 * 60;

export async function getSpeakingAttempts(): Promise<SpeakingAttemptWithQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_attempts")
    .select("*, speaking_questions(part, group_label, order_index, prompt_text)")
    .order("started_at", { ascending: false });

  if (error) throw error;
  const attempts = data as unknown as Omit<SpeakingAttemptWithQuestion, "audioUrl">[];

  return Promise.all(
    attempts.map(async (attempt) => {
      if (!attempt.audio_path) return { ...attempt, audioUrl: null };
      const { data: signed } = await supabase.storage
        .from("speaking-recordings")
        .createSignedUrl(attempt.audio_path, SIGNED_URL_TTL_SEC);
      return { ...attempt, audioUrl: signed?.signedUrl ?? null };
    }),
  );
}

export async function getAttemptedSpeakingQuestionIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("speaking_attempts").select("question_id");

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.question_id as string));
}
