"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createPracticeSession, completePracticeSession } from "@/app/full-test/actions";
import { formatClock, WRITING_PART1_GROUP_SEC } from "@/lib/examTiming";
import type { WritingQuestion } from "@/types/database";

type Stage =
  | { kind: "group"; label: string; questions: WritingQuestion[]; totalSec: number }
  | { kind: "single"; label: string; question: WritingQuestion; totalSec: number };

function buildStages(questions: WritingQuestion[]): Stage[] {
  const byPart = (part: number) =>
    questions.filter((q) => q.part === part).sort((a, b) => a.order_index - b.order_index);

  const part1 = byPart(1);
  const part2 = byPart(2);
  const part3 = byPart(3);

  return [
    { kind: "group", label: "Part 1 — Viết câu từ tranh", questions: part1, totalSec: WRITING_PART1_GROUP_SEC },
    ...part2.map((q) => ({ kind: "single" as const, label: "Part 2 — Trả lời email", question: q, totalSec: q.time_limit_sec })),
    ...part3.map((q) => ({ kind: "single" as const, label: "Part 3 — Luận nêu ý kiến", question: q, totalSec: q.time_limit_sec })),
  ];
}

type Phase = "intro" | "active" | "finished";

export default function FullTestWritingClient({ questions }: { questions: WritingQuestion[] }) {
  const stages = useRef(buildStages(questions)).current;

  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stages[0]?.totalSec ?? 0);
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const advancingRef = useRef(false);
  const stageStartedAtRef = useRef<string>(new Date().toISOString());

  useEffect(() => {
    if (phase !== "active") return;
    if (timeLeft <= 0) {
      void goNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  async function start() {
    setStarting(true);
    const id = await createPracticeSession("writing_full");
    setSessionId(id);
    setStageIndex(0);
    setTimeLeft(stages[0].totalSec);
    stageStartedAtRef.current = new Date().toISOString();
    setPhase("active");
    setStarting(false);
  }

  async function goNext() {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setError(null);

    const stage = stages[stageIndex];
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setError("Bạn cần đăng nhập lại.");
      advancingRef.current = false;
      return;
    }

    const elapsed = stage.totalSec - timeLeft;
    const startedAt = stageStartedAtRef.current;
    const submittedAt = new Date().toISOString();
    const rows =
      stage.kind === "group"
        ? stage.questions.map((q) => ({
            user_id: user.id,
            question_id: q.id,
            session_id: sessionId,
            answer_text: answers[q.id] ?? "",
            started_at: startedAt,
            submitted_at: submittedAt,
            duration_sec: elapsed,
          }))
        : [
            {
              user_id: user.id,
              question_id: stage.question.id,
              session_id: sessionId,
              answer_text: answers[stage.question.id] ?? "",
              started_at: startedAt,
              submitted_at: submittedAt,
              duration_sec: elapsed,
            },
          ];

    const { error: insertError } = await supabase.from("writing_attempts").insert(rows);
    if (insertError) {
      setError(insertError.message);
      advancingRef.current = false;
      return;
    }

    const nextIndex = stageIndex + 1;
    if (nextIndex < stages.length) {
      setStageIndex(nextIndex);
      setTimeLeft(stages[nextIndex].totalSec);
      setActiveGroupIdx(0);
      stageStartedAtRef.current = new Date().toISOString();
    } else {
      if (sessionId) await completePracticeSession(sessionId);
      setPhase("finished");
    }
    advancingRef.current = false;
  }

  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Bài test gồm 8 câu chia 3 phần, chạy liên tục không dừng: Part 1 (8 phút cho 5 câu), Part 2
          (10 phút/câu), Part 3 (30 phút).
        </p>
        <button
          onClick={start}
          disabled={starting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {starting ? "Đang chuẩn bị..." : "Bắt đầu Full Test Writing"}
        </button>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-green-700">
          Đã hoàn thành Full Test Writing! Tất cả bài làm đã được lưu.
        </p>
        <Link href="/history" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
          Xem lại lịch sử
        </Link>
      </div>
    );
  }

  const stage = stages[stageIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400">{stage.label}</p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {formatClock(timeLeft)}
        </span>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {stage.kind === "group" ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            {stage.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setActiveGroupIdx(i)}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  i === activeGroupIdx
                    ? "bg-blue-600 text-white"
                    : answers[q.id]
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                Câu {q.order_index}
              </button>
            ))}
          </div>

          {(() => {
            const q = stage.questions[activeGroupIdx];
            return (
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  {q.context && <p className="text-sm text-gray-600">{q.context}</p>}
                  {q.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={q.image_url} alt="" className="mt-2 max-h-80 w-full rounded-md object-contain" />
                  )}
                  <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-gray-900">{q.prompt_text}</p>
                </div>
                <textarea
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  rows={4}
                  placeholder="Viết câu trả lời của bạn ở đây..."
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            );
          })()}

          <button
            onClick={goNext}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nộp Part 1 &amp; tiếp tục →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            {stage.question.context && <p className="text-sm text-gray-600">{stage.question.context}</p>}
            <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-gray-900">
              {stage.question.prompt_text}
            </p>
          </div>
          <textarea
            value={answers[stage.question.id] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [stage.question.id]: e.target.value }))}
            rows={10}
            placeholder="Viết câu trả lời của bạn ở đây..."
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={goNext}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nộp &amp; tiếp tục →
          </button>
        </div>
      )}
    </div>
  );
}
