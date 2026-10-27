"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatClock } from "@/lib/examTiming";
import WaveformBars from "@/components/WaveformBars";
import type { SpeakingQuestion } from "@/types/database";

type Phase = "ready" | "prep" | "recording" | "review";

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export default function SpeakingRecorder({
  question,
  sessionId,
  onSubmitted,
}: {
  question: SpeakingQuestion;
  sessionId?: string;
  onSubmitted: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(question.prep_time_sec || question.speak_time_sec);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const startedAtRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    startedAtRef.current = new Date().toISOString();
    setError(null);
    if (question.prep_time_sec > 0) {
      setTimeLeft(question.prep_time_sec);
      setPhase("prep");
    } else {
      void beginRecording();
    }
  }

  async function beginRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        audioBlobRef.current = blob;
        setAudioUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setPhase("review");
      };

      recorder.start();
      setTimeLeft(question.speak_time_sec);
      setPhase("recording");
    } catch {
      setError("Không thể truy cập micro. Hãy kiểm tra quyền truy cập micro cho trang web này.");
      setPhase("ready");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  useEffect(() => {
    if (phase !== "prep" && phase !== "recording") return;
    if (timeLeft <= 0) {
      if (phase === "prep") {
        void beginRecording();
      } else {
        stopRecording();
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function reRecord() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlobRef.current = null;
    setError(null);
    setPhase("ready");
  }

  async function save() {
    const blob = audioBlobRef.current;
    if (!blob) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setError("Bạn cần đăng nhập lại.");
      setSaving(false);
      return;
    }

    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    const path = `${user.id}/${question.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("speaking-recordings")
      .upload(path, blob, { contentType: blob.type });

    if (uploadError) {
      setError(uploadError.message);
      setSaving(false);
      return;
    }

    const startedAt = startedAtRef.current ?? new Date().toISOString();
    const { error: insertError } = await supabase.from("speaking_attempts").insert({
      user_id: user.id,
      question_id: question.id,
      session_id: sessionId ?? null,
      audio_path: path,
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      duration_sec: question.speak_time_sec,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    onSubmitted();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted">
          Part {question.part} · {question.group_label} · Câu {question.order_index}
        </p>
        {(phase === "prep" || phase === "recording") && (
          <span className={phase === "recording" ? "pill-rec flex items-center gap-2" : "pill-timer"}>
            {phase === "recording" && <WaveformBars active bars={4} className="h-3" />}
            {phase === "prep" ? "Chuẩn bị" : "Đang ghi âm"} · {formatClock(timeLeft)}
          </span>
        )}
      </div>

      <div className="card p-5">
        {question.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={question.image_url} alt="" className="mb-3 max-h-80 w-full rounded-md object-contain" />
        )}
        <p className="whitespace-pre-wrap text-sm font-medium text-[var(--color-ink)]">{question.prompt_text}</p>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {phase === "ready" && (
        <button onClick={start} className="btn-accent">
          Bắt đầu
        </button>
      )}

      {phase === "review" && audioUrl && (
        <div className="space-y-3">
          <audio controls src={audioUrl} className="w-full" />
          <div className="flex gap-3">
            <button onClick={reRecord} className="btn-ghost">
              Ghi âm lại
            </button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Đang lưu..." : "Lưu bài làm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
