"use client";

import { useState } from "react";
import Link from "next/link";
import { createPracticeSession, completePracticeSession } from "@/app/full-test/actions";
import { gradeSpeakingAttempt } from "@/app/speaking/gradeActions";
import SpeakingRecorder from "@/components/speaking/SpeakingRecorder";
import type { SpeakingQuestion } from "@/types/database";

type Phase = "intro" | "active" | "finished";

export default function FullTestSpeakingClient({
  questions,
  testLabel = "Full Test Speaking",
}: {
  questions: SpeakingQuestion[];
  testLabel?: string;
}) {
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

  async function handleNext(attemptId: string, transcript: string) {
    // Grade in the background so the timed flow never waits on the AI call --
    // results show up later in History. Failures are swallowed here; they're
    // already visible as a missing score/feedback on the attempt.
    void gradeSpeakingAttempt(attemptId, transcript).catch(() => {});

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    if (sessionId) await completePracticeSession(sessionId);
    setPhase("finished");
  }

  if (phase === "intro") {
    return (
      <div className="animate-fade-up space-y-4">
        <p className="text-sm text-muted">
          Bài test gồm {questions.length} câu, chạy liên tục không dừng. Hãy chuẩn bị micro trước khi bắt đầu.
        </p>
        <button onClick={start} disabled={starting} className="btn-primary">
          {starting ? "Đang chuẩn bị..." : `Bắt đầu ${testLabel}`}
        </button>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="animate-fade-up space-y-4">
        <p className="text-success text-sm">Đã hoàn thành {testLabel}! Tất cả bài ghi âm đã được lưu.</p>
        <p className="text-sm text-muted">AI đang chấm điểm ở nền, xem kết quả trong Lịch sử sau ít phút.</p>
        <Link href="/history" className="btn-dark">
          Xem lại lịch sử
        </Link>
      </div>
    );
  }

  const question = questions[currentIndex];
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-muted">
        Câu {currentIndex + 1} / {questions.length}
      </p>
      <SpeakingRecorder key={question.id} question={question} sessionId={sessionId ?? undefined} onSubmitted={handleNext} />
    </div>
  );
}
