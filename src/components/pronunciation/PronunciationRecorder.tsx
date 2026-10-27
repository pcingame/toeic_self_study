"use client";

import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  maxAlternatives: number;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type RecState = "idle" | "recording" | "done";
type Verdict = "correct" | "incorrect" | null;

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z' ]/g, "");
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Single-word check: exact match, whole-word match within a longer transcript,
// or small edit distance to tolerate recognizer noise.
function isMatch(target: string, heard: string): boolean {
  const t = normalize(target);
  const h = normalize(heard);
  if (!t || !h) return false;
  if (t === h) return true;
  if (h.split(/\s+/).includes(t)) return true;
  const dist = levenshtein(t, h);
  return dist <= Math.max(1, Math.floor(t.length * 0.3));
}

export default function PronunciationRecorder({ word }: { word: string }) {
  const [recState, setRecState] = useState<RecState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported] = useState(
    () => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    try {
      recognitionRef.current?.stop();
    } catch {
      // already stopped
    }
    setRecState("done");
  }

  async function start() {
    setError(null);
    setTranscript(null);
    setVerdict(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

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
        setAudioUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      recorder.start();

      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (Ctor) {
        const recognition = new Ctor();
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;
        recognition.interimResults = false;
        recognition.onresult = (e) => {
          const heard = e.results[0]?.[0]?.transcript ?? "";
          setTranscript(heard);
          setVerdict(isMatch(word, heard) ? "correct" : "incorrect");
        };
        recognition.onerror = (e) => {
          if (e.error === "no-speech") setError("Không nghe thấy gì, hãy thử lại.");
        };
        recognition.onend = () => stop();
        recognitionRef.current = recognition;
        recognition.start();
      }

      setRecState("recording");
    } catch {
      setError("Không thể truy cập micro. Hãy kiểm tra quyền truy cập micro cho trang web này.");
      setRecState("idle");
    }
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscript(null);
    setVerdict(null);
    setError(null);
    setRecState("idle");
  }

  return (
    <div className="space-y-2 rounded-md border border-dashed border-gray-200 p-3 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Luyện phát âm</span>
        {recState === "recording" ? (
          <button
            onClick={stop}
            className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300"
          >
            ■ Dừng
          </button>
        ) : (
          <button
            onClick={start}
            className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            🎤 Ghi âm
          </button>
        )}
      </div>

      {!speechSupported && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Trình duyệt này không hỗ trợ nhận diện giọng nói — chỉ ghi âm để tự nghe lại, không kiểm tra đúng/sai
          được. Dùng Chrome để có tính năng kiểm tra.
        </p>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      {recState === "recording" && (
        <p className="text-xs text-red-600 dark:text-red-400">● Đang nghe, hãy đọc từ &quot;{word}&quot;...</p>
      )}

      {recState === "done" && (
        <div className="space-y-2">
          {audioUrl && <audio controls src={audioUrl} className="w-full" />}
          {verdict && (
            <p
              className={`text-xs font-medium ${
                verdict === "correct" ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {verdict === "correct"
                ? `✅ Đúng rồi! Nhận diện: "${transcript}"`
                : `⚠️ Chưa khớp. Máy nghe được: "${transcript}" — hãy thử lại.`}
            </p>
          )}
          <button
            onClick={reset}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}
