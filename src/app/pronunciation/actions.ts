"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPronunciationList(title: string, words: string[]): Promise<string> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const cleanWords = words.map((w) => w.trim()).filter(Boolean);
  if (cleanWords.length === 0) throw new Error("Danh sách từ rỗng");

  const { data: list, error: listError } = await supabase
    .from("pronunciation_lists")
    .insert({ user_id: userData.user.id, title: title.trim() || "Danh sách chưa đặt tên" })
    .select("id")
    .single();

  if (listError) throw listError;

  const { error: itemsError } = await supabase.from("pronunciation_items").insert(
    cleanWords.map((word, index) => ({
      list_id: list.id,
      user_id: userData.user!.id,
      word,
      order_index: index,
    })),
  );

  if (itemsError) throw itemsError;

  revalidatePath("/pronunciation");
  return list.id as string;
}

export async function deletePronunciationList(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("pronunciation_lists").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/pronunciation");
}
