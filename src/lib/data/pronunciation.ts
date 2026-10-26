import { createClient } from "@/lib/supabase/server";
import type { PronunciationItem, PronunciationList } from "@/types/database";

export interface PronunciationListSummary extends PronunciationList {
  item_count: number;
}

export async function getPronunciationLists(): Promise<PronunciationListSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pronunciation_lists")
    .select("*, pronunciation_items(count)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as (PronunciationList & { pronunciation_items: { count: number }[] })[]).map(
    (row) => ({ ...row, item_count: row.pronunciation_items?.[0]?.count ?? 0 }),
  );
}

export async function getPronunciationListWithItems(
  id: string,
): Promise<{ list: PronunciationList; items: PronunciationItem[] } | null> {
  const supabase = await createClient();
  const { data: list, error: listError } = await supabase
    .from("pronunciation_lists")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (listError) throw listError;
  if (!list) return null;

  const { data: items, error: itemsError } = await supabase
    .from("pronunciation_items")
    .select("*")
    .eq("list_id", id)
    .order("order_index", { ascending: true });

  if (itemsError) throw itemsError;
  return { list: list as PronunciationList, items: (items ?? []) as PronunciationItem[] };
}
