"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPronunciationList } from "@/app/pronunciation/actions";
import { SAMPLE_WORD_LIST } from "@/lib/pronunciationTips";

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

  function loadSample() {
    setTitle(SAMPLE_WORD_LIST.title);
    setRaw(SAMPLE_WORD_LIST.words.join("\n"));
  }

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
    <div className="card space-y-3 p-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Tên danh sách (tùy chọn)
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Âm TH và V/W"
          className="input-field mt-1"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="words" className="block text-sm font-medium">
            Dán danh sách từ (mỗi từ 1 dòng, hoặc ngăn bằng dấu phẩy)
          </label>
          <button type="button" onClick={loadSample} className="link-muted">
            Dùng danh sách mẫu (Homework IPA)
          </button>
        </div>
        <textarea
          id="words"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder={"pen\npump\nbump\ncab\n..."}
          className="input-field mt-1"
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{words.length} từ</p>
        <button onClick={submit} disabled={words.length === 0 || creating} className="btn-primary">
          {creating ? "Đang tạo..." : "Tạo danh sách phát âm"}
        </button>
      </div>
    </div>
  );
}
