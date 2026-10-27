"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatClock } from "@/lib/examTiming";
import type { WritingQuestion } from "@/types/database";

type Phase = "ready" | "active" | "submitted";

export default function WritingPracticeClient({
  question,
  nextHref,
  sessionId,
}: {
  question: WritingQuestion;
  nextHref: string;
  sessionId?: string;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(question.time_limit_sec);
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const startedAtRef = useRef<string | null>(null);
  const answerRef = useRef(answer);
  answerRef.current = answer;

  useEffect(() => {
    if (phase !== "active") return;
    if (timeLeft <= 0) {
      void submit(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function start() {
    startedAtRef.current = new Date().toISOString();
    setPhase("active");
  }

  async function submit(autoSubmitted: boolean) {
    if (phase === "submitted" || saving) return;
    setSaving(true);
    setSaveError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setSaveError("Bạn cần đăng nhập lại.");
      setSaving(false);
      return;
    }

    const startedAt = startedAtRef.current ?? new Date().toISOString();
    const durationSec = question.time_limit_sec - (autoSubmitted ? 0 : timeLeft);

    const { error } = await supabase.from("writing_attempts").insert({
      user_id: user.id,
      question_id: question.id,
      session_id: sessionId ?? null,
      answer_text: answerRef.current,
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      duration_sec: durationSec,
    });

    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setPhase("submitted");
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/writing" className="link-muted">
          ← Quay lại danh sách Writing
        </Link>
        {phase === "active" && <span className="pill-timer">{formatClock(timeLeft)}</span>}
      </div>

      <div className="card p-5">
        <p className="text-xs font-medium text-muted">
          Part {question.part} · {question.group_label} · Câu {question.order_index}
        </p>
        {question.context && <p className="mt-2 text-sm text-muted">{question.context}</p>}
        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={question.image_url} alt="" className="mt-3 max-h-80 w-full rounded-md object-contain" />
        )}
        <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-[var(--color-ink)]">{question.prompt_text}</p>
      </div>

      {phase === "ready" && (
        <button onClick={start} className="btn-primary">
          Bắt đầu ({formatClock(question.time_limit_sec)})
        </button>
      )}

      {phase !== "ready" && (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={phase === "submitted"}
            rows={10}
            placeholder="Viết câu trả lời của bạn ở đây..."
            className="input-field"
          />
          {saveError && <p className="text-error text-sm">{saveError}</p>}
          {phase === "active" && (
            <button onClick={() => submit(false)} disabled={saving} className="btn-primary">
              {saving ? "Đang lưu..." : "Nộp bài"}
            </button>
          )}
          {phase === "submitted" && (
            <div className="flex items-center gap-3">
              <p className="text-success text-sm">Đã lưu bài làm.</p>
              <Link href={nextHref} className="btn-dark">
                Câu tiếp theo →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
