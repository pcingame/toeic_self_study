"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPronunciationList } from "@/app/pronunciation/actions";
import { SAMPLE_WORD_LIST } from "@/lib/pronunciationTips";

function parseWords(raw: string): string[] {
  const tokens = raw
    .split(/[\n,]+/)
    .flatMap((line) => line.trim().split(/\s+/))
    // Strip sentence/paragraph punctuation (periods, quotes, parens...) from
    // word edges so pasting running text works, not just one-word-per-line
    // lists. Keeps internal apostrophes/hyphens (don't, well-known).
    .map((w) => w.replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, ""))
    .filter(Boolean);

  // Dedupe case-insensitively, keeping first-seen casing/order -- a
  // paragraph repeats common words far more than a deliberate word list does.
  const seen = new Set<string>();
  const result: string[] = [];
  for (const w of tokens) {
    const key = w.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(w);
  }
  return result;
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
            Dán danh sách từ, một câu dài, hoặc cả đoạn văn
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
          placeholder={"pen\npump\nbump\ncab\n...\n\nhoặc dán nguyên 1 câu/đoạn văn, hệ thống sẽ tự tách từng từ"}
          className="input-field mt-1"
        />
        <p className="mt-1 text-xs text-muted">
          Mỗi từ 1 dòng, ngăn bằng dấu phẩy, hoặc dán nguyên câu/đoạn văn — hệ thống tự tách từng từ và bỏ từ trùng
          lặp.
        </p>
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
