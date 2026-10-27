"use client";

import { useTransition } from "react";
import { deletePronunciationList } from "@/app/pronunciation/actions";

export default function DeleteListButton({ listId, title }: { listId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Xóa danh sách "${title}"? Không thể hoàn tác.`)) return;
    startTransition(async () => {
      await deletePronunciationList(listId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-xs text-muted hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
    >
      {pending ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
