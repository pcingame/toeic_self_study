import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  writingAttemptsCount: number;
  writingQuestionsCovered: number;
  writingQuestionsTotal: number;
  speakingAttemptsCount: number;
  speakingQuestionsCovered: number;
  speakingQuestionsTotal: number;
  recentActivity: {
    id: string;
    type: "writing" | "speaking";
    label: string;
    startedAt: string;
    href: string;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    { count: writingQuestionsTotal },
    { count: speakingQuestionsTotal },
    { data: writingAttempts },
    { data: speakingAttempts },
  ] = await Promise.all([
    supabase.from("writing_questions").select("id", { count: "exact", head: true }),
    supabase.from("speaking_questions").select("id", { count: "exact", head: true }),
    supabase
      .from("writing_attempts")
      .select("id, question_id, started_at, writing_questions(part, order_index)")
      .order("started_at", { ascending: false }),
    supabase
      .from("speaking_attempts")
      .select("id, question_id, started_at, speaking_questions(part, order_index)")
      .order("started_at", { ascending: false }),
  ]);

  const writing = writingAttempts ?? [];
  const speaking = speakingAttempts ?? [];

  const recentActivity = [
    ...writing.map((a) => {
      const q = (a as unknown as { writing_questions: { part: number; order_index: number } }).writing_questions;
      return {
        id: a.id as string,
        type: "writing" as const,
        label: `Writing Part ${q?.part} · Câu ${q?.order_index}`,
        startedAt: a.started_at as string,
        href: `/writing/${q?.part}/${a.question_id}`,
      };
    }),
    ...speaking.map((a) => {
      const q = (a as unknown as { speaking_questions: { part: number; order_index: number } }).speaking_questions;
      return {
        id: a.id as string,
        type: "speaking" as const,
        label: `Speaking Part ${q?.part} · Câu ${q?.order_index}`,
        startedAt: a.started_at as string,
        href: `/speaking/${q?.part}/${a.question_id}`,
      };
    }),
  ]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 6);

  return {
    writingAttemptsCount: writing.length,
    writingQuestionsCovered: new Set(writing.map((a) => a.question_id)).size,
    writingQuestionsTotal: writingQuestionsTotal ?? 0,
    speakingAttemptsCount: speaking.length,
    speakingQuestionsCovered: new Set(speaking.map((a) => a.question_id)).size,
    speakingQuestionsTotal: speakingQuestionsTotal ?? 0,
    recentActivity,
  };
}
