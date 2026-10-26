"use server";

import { createClient } from "@/lib/supabase/server";
import type { SessionType } from "@/types/database";

export async function createPracticeSession(type: SessionType): Promise<string> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("practice_sessions")
    .insert({ user_id: userData.user.id, type })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function completePracticeSession(sessionId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("practice_sessions")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", sessionId);
}
