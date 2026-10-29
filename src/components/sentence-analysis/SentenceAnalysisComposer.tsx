"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSentenceAnalysis } from "@/app/sentence-analysis/actions";

const SAMPLE_SENTENCE = "I know that it's right.";

export default function SentenceAnalysisComposer() {
  const router = useRouter();
  const [sentence, setSentence] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!sentence.trim() || analyzing) return;
    setAnalyzing(true);
    setError(null);
    try {
      const id = await createSentenceAnalysis(sentence);
      router.push(`/sentence-analysis/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
      setAnalyzing(false);
    }
  }

  return (
    <div className="card space-y-3 p-5">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="sentence" className="block text-sm font-medium">
            Dán một câu tiếng Anh cần phân tích
          </label>
          <button type="button" onClick={() => setSentence(SAMPLE_SENTENCE)} className="link-muted">
            Dùng câu mẫu
          </button>
        </div>
        <textarea
          id="sentence"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          rows={3}
          placeholder={SAMPLE_SENTENCE}
          className="input-field mt-1"
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex justify-end">
        <button onClick={submit} disabled={!sentence.trim() || analyzing} className="btn-primary">
          {analyzing ? "Đang phân tích bằng AI..." : "Phân tích câu"}
        </button>
      </div>
    </div>
  );
}
