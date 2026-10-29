import { createClient } from "@/lib/supabase/server";
import type { WritingQuestion } from "@/types/database";

const SIGNED_URL_TTL_SEC = 60 * 60;

// Question images are stored as storage paths (e.g. "writing-part1/100.jpeg")
// in the private "question-images" bucket, not raw URLs -- resolve them to a
// time-limited signed URL here so they stay renderable without ever being
// stored as a permanent (and expiring) signed link.
async function resolveImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string | null,
): Promise<string | null> {
  if (!imageUrl || /^https?:\/\//.test(imageUrl)) return imageUrl;
  const { data } = await supabase.storage
    .from("question-images")
    .createSignedUrl(imageUrl, SIGNED_URL_TTL_SEC);
  return data?.signedUrl ?? null;
}

export async function getWritingQuestions(): Promise<WritingQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_questions")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  const questions = data as WritingQuestion[];
  return Promise.all(
    questions.map(async (q) => ({ ...q, image_url: await resolveImageUrl(supabase, q.image_url) })),
  );
}

export async function getWritingQuestionById(id: string): Promise<WritingQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const question = data as WritingQuestion;
  return { ...question, image_url: await resolveImageUrl(supabase, question.image_url) };
}

export function getNextWritingQuestion(
  all: WritingQuestion[],
  current: WritingQuestion,
): WritingQuestion | null {
  const sorted = [...all].sort((a, b) => a.order_index - b.order_index);
  const idx = sorted.findIndex((q) => q.id === current.id);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
}
