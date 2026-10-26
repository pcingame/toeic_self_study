"use client";

import { useState } from "react";
import Link from "next/link";
import { createPracticeSession, completePracticeSession } from "@/app/full-test/actions";
import SpeakingRecorder from "@/components/speaking/SpeakingRecorder";
import type { SpeakingQuestion } from "@/types/database";

type Phase = "intro" | "active" | "finished";

export default function FullTestSpeakingClient({ questions }: { questions: SpeakingQuestion[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [starting, setStarting] = useState(false);

  async function start() {
    setStarting(true);
    const id = await createPracticeSession("speaking_full");
    setSessionId(id);
    setCurrentIndex(0);
    setPhase("active");
    setStarting(false);
  }

  async function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    if (sessionId) await completePracticeSession(sessionId);
    setPhase("finished");
  }

  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Bài test gồm {questions.length} câu, chạy liên tục không dừng. Hãy chuẩn bị micro trước khi bắt đầu.
        </p>
        <button
          onClick={start}
          disabled={starting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {starting ? "Đang chuẩn bị..." : "Bắt đầu Full Test Speaking"}
        </button>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-green-700">
          Đã hoàn thành Full Test Speaking! Tất cả bài ghi âm đã được lưu.
        </p>
        <Link href="/history" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          Xem lại lịch sử
        </Link>
      </div>
    );
  }

  const question = questions[currentIndex];
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-gray-400">
        Câu {currentIndex + 1} / {questions.length}
      </p>
      <SpeakingRecorder key={question.id} question={question} sessionId={sessionId ?? undefined} onSubmitted={handleNext} />
    </div>
  );
}
