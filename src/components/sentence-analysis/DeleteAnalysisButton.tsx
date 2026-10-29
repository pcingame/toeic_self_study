"use client";

import { useTransition } from "react";
import { deleteSentenceAnalysis } from "@/app/sentence-analysis/actions";

export default function DeleteAnalysisButton({ analysisId, sentence }: { analysisId: string; sentence: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Xóa câu "${sentence}"? Không thể hoàn tác.`)) return;
    startTransition(async () => {
      await deleteSentenceAnalysis(analysisId);
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
