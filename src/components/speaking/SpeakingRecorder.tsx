"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatClock } from "@/lib/examTiming";
import WaveformBars from "@/components/WaveformBars";
import type { SpeakingQuestion } from "@/types/database";

type Phase = "ready" | "prep" | "recording" | "review";

// How long to wait for the recorder to actually stop (fire onstop) after
// calling stop() before giving up and surfacing an error. A clean stop is
// near-instant; a stuck one (device dropped mid-recording, etc.) would
// otherwise freeze the UI on "Đang ghi âm" with a dead countdown forever.
const RECORDER_STOP_TIMEOUT_MS = 5_000;

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function describeMicError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Trình duyệt chặn quyền truy cập micro. Hãy cấp quyền rồi thử lại.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "Không tìm thấy micro. Hãy kiểm tra thiết bị ghi âm.";
    case "NotReadableError":
    case "TrackStartError":
      return "Micro đang được ứng dụng khác sử dụng. Hãy đóng ứng dụng đó rồi thử lại.";
    default:
      return "Không thể truy cập micro. Hãy kiểm tra quyền truy cập micro cho trang web này.";
  }
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
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (phase !== "ready") return;
    startedAtRef.current = new Date().toISOString();
    setError(null);
    if (question.prep_time_sec > 0) {
      setTimeLeft(question.prep_time_sec);
      setPhase("prep");
    } else {
      void beginRecording();
    }
  }

  function failRecording(message: string) {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setError(message);
    setPhase("ready");
  }

  async function beginRecording() {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setError(describeMicError(err));
      setPhase("ready");
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    let recorder: MediaRecorder;
    const mimeType = pickMimeType();
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      setError("Trình duyệt này không hỗ trợ ghi âm. Hãy thử trên Chrome hoặc Edge.");
      setPhase("ready");
      return;
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      audioBlobRef.current = blob;
      setAudioUrl(URL.createObjectURL(blob));
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setPhase("review");
    };
    recorder.onerror = () => {
      failRecording("Có lỗi khi ghi âm (thiết bị bị ngắt giữa chừng?). Hãy thử ghi âm lại.");
    };

    recorder.start();
    setTimeLeft(question.speak_time_sec);
    setPhase("recording");
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      stopTimeoutRef.current = setTimeout(
        () => failRecording("Ghi âm bị treo và không dừng được. Hãy thử ghi âm lại."),
        RECORDER_STOP_TIMEOUT_MS,
      );
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
      setError(`Lỗi khi tải file ghi âm lên: ${uploadError.message}`);
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
      setError(`Lỗi khi lưu bài làm: ${insertError.message}`);
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
