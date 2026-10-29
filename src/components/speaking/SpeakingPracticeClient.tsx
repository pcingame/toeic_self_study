"use client";

import { useState } from "react";
import Link from "next/link";
import SpeakingRecorder from "./SpeakingRecorder";
import { gradeSpeakingAttempt } from "@/app/speaking/gradeActions";
import type { GradeResult, SpeakingQuestion } from "@/types/database";

type GradeState = "idle" | "grading" | "done" | "skipped" | "error";

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
  const [gradeState, setGradeState] = useState<GradeState>("idle");
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  async function handleSubmitted(attemptId: string, transcript: string) {
    setSubmitted(true);
    setGradeState("grading");
    try {
      const result = await gradeSpeakingAttempt(attemptId, transcript);
      if (result) {
        setGrade(result);
        setGradeState("done");
      } else {
        setGradeState("skipped");
      }
    } catch (err) {
      setGradeError(err instanceof Error ? err.message : "Không chấm được điểm cho bài này.");
      setGradeState("error");
    }
  }

  return (
    <div className="animate-fade-up space-y-5">
      <Link href="/speaking" className="link-muted">
        ← Quay lại danh sách Speaking
      </Link>

      {!submitted ? (
        <SpeakingRecorder question={question} sessionId={sessionId} onSubmitted={handleSubmitted} />
      ) : (
        <div className="space-y-3">
          <p className="text-success text-sm">Đã lưu bài làm.</p>

          {gradeState === "grading" && <p className="text-sm text-muted">Đang chấm điểm bằng AI (dựa trên transcript nhận diện giọng nói)...</p>}
          {gradeState === "skipped" && (
            <p className="text-sm text-muted">
              Không nhận diện được giọng nói để chấm điểm (trình duyệt không hỗ trợ, hoặc nói quá nhỏ/không rõ). Bạn
              vẫn có thể nghe lại bản ghi âm ở mục Lịch sử.
            </p>
          )}
          {gradeState === "error" && <p className="text-error text-sm">{gradeError}</p>}
          {gradeState === "done" && grade && (
            <div className="card space-y-2 p-4">
              <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
                {grade.score}/{grade.maxScore} điểm
              </p>
              {grade.strengths && <p className="text-sm text-success">{grade.strengths}</p>}
              <p className="whitespace-pre-wrap text-sm text-[var(--color-ink)]/80">{grade.improvements}</p>
              {question.part === 1 && (
                <p className="text-xs text-muted">
                  Lưu ý: điểm này chỉ dựa trên transcript (nội dung đọc được), không đánh giá được phát âm/ngữ điệu —
                  hãy tự nghe lại bản ghi âm và đối chiếu{" "}
                  <Link href="/speaking/part1-guide" className="text-[var(--color-primary)] hover:underline">
                    hướng dẫn phát âm
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          <Link href={nextHref} className="btn-dark">
            Câu tiếp theo →
          </Link>
        </div>
      )}
    </div>
  );
}
