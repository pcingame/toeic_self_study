"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPronunciationList } from "@/app/pronunciation/actions";

function parseWords(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .flatMap((line) => line.trim().split(/\s+/))
    .map((w) => w.trim())
    .filter(Boolean);
}

export default function PronunciationComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [raw, setRaw] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(() => parseWords(raw), [raw]);

  async function submit() {
    if (words.length === 0) return;
    setCreating(true);
    setError(null);
    try {
      const id = await createPronunciationList(title, words);
      router.push(`/pronunciation/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
      setCreating(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Tên danh sách (tùy chọn)
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Âm TH và V/W"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="words" className="block text-sm font-medium">
          Dán danh sách từ (mỗi từ 1 dòng, hoặc ngăn bằng dấu phẩy)
        </label>
        <textarea
          id="words"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder={"pen\npump\nbump\ncab\n..."}
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{words.length} từ</p>
        <button
          onClick={submit}
          disabled={words.length === 0 || creating}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? "Đang tạo..." : "Tạo danh sách phát âm"}
        </button>
      </div>
    </div>
  );
}
