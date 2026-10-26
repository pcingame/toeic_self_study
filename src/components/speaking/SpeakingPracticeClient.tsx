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
    <div className="space-y-5">
      <Link href="/speaking" className="text-sm text-gray-500 hover:text-blue-600">
        ← Quay lại danh sách Speaking
      </Link>

      {!submitted ? (
        <SpeakingRecorder question={question} sessionId={sessionId} onSubmitted={() => setSubmitted(true)} />
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-green-700">Đã lưu bài làm.</p>
          <Link
            href={nextHref}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Câu tiếp theo →
          </Link>
        </div>
      )}
    </div>
  );
}
