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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/writing" className="text-sm text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">
          ← Quay lại danh sách Writing
        </Link>
        {phase === "active" && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            {formatClock(timeLeft)}
          </span>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">
          Part {question.part} · {question.group_label} · Câu {question.order_index}
        </p>
        {question.context && <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">{question.context}</p>}
        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={question.image_url} alt="" className="mt-3 max-h-80 w-full rounded-md object-contain" />
        )}
        <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-gray-900 dark:text-zinc-100">
          {question.prompt_text}
        </p>
      </div>

      {phase === "ready" && (
        <button
          onClick={start}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
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
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:disabled:bg-zinc-800"
          />
          {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
          {phase === "active" && (
            <button
              onClick={() => submit(false)}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {saving ? "Đang lưu..." : "Nộp bài"}
            </button>
          )}
          {phase === "submitted" && (
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Đã lưu bài làm.</p>
              <Link
                href={nextHref}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Câu tiếp theo →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
