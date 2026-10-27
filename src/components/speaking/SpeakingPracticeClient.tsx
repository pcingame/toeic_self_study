"use client";

import { useState } from "react";
import Link from "next/link";
import SpeakingRecorder from "./SpeakingRecorder";
import type { SpeakingQuestion } from "@/types/database";

export default function SpeakingPracticeClient({
  question,
  nextHref,
  sessionId,
}: {
  question: SpeakingQuestion;
  nextHref: string;
  sessionId?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="animate-fade-up space-y-5">
      <Link href="/speaking" className="link-muted">
        ← Quay lại danh sách Speaking
      </Link>

      {!submitted ? (
        <SpeakingRecorder question={question} sessionId={sessionId} onSubmitted={() => setSubmitted(true)} />
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-success text-sm">Đã lưu bài làm.</p>
          <Link href={nextHref} className="btn-dark">
            Câu tiếp theo →
          </Link>
        </div>
      )}
    </div>
  );
}
