"use client";

import { useEffect, useState } from "react";
import { getTipsForWord } from "@/lib/pronunciationTips";
import { lookupPhonetic } from "@/lib/phonetics";
import PronunciationRecorder from "@/components/pronunciation/PronunciationRecorder";

// Chrome silently drops the very first speechSynthesis.speak() call if the
// voice list hasn't finished loading yet -- wait for it (with a timeout so
// we never hang forever on browsers that never fire the event).
function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timeout);
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

// How long to wait for playback to actually start before assuming it
// silently failed. Chrome on macOS has a long-standing bug where the
// speechSynthesis engine (and occasionally a plain <audio> element) goes
// quiet -- no error, no "playing"/"start" event -- after the tab loses
// focus or the machine sits idle for a while.
const PLAYBACK_START_TIMEOUT_MS = 1200;

// Builds and speaks one utterance, resolving once we know whether it
// actually started. Chrome on macOS can silently ignore speak() right after
// cancel() (needs a tick to catch up) or ignore it entirely if the speech
// engine has gone to sleep -- callers retry once on anything but "ok".
function attemptSpeak(word: string, voices: SpeechSynthesisVoice[]): Promise<"ok" | "error" | "timeout"> {
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.resume();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  const enVoice = voices.find((v) => v.lang === "en-US") ?? voices.find((v) => v.lang.startsWith("en"));
  if (enVoice) utterance.voice = enVoice;

  return new Promise((resolve) => {
    let settled = false;
    const settle = (result: "ok" | "error" | "timeout") => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    utterance.onstart = () => settle("ok");
    utterance.onerror = (e) => {
      // Chrome fires "canceled"/"interrupted" on the new utterance itself
      // when cancel() is called right before speak() (as we just did above),
      // even though it goes on to play fine -- let the timeout decide instead.
      if (e.error === "canceled" || e.error === "interrupted") return;
      settle("error");
    };
    setTimeout(() => synth.speak(utterance), 50);
    setTimeout(() => settle("timeout"), PLAYBACK_START_TIMEOUT_MS);
  });
}

export default function PronunciationWordCard({ word }: { word: string }) {
  const [phonetic, setPhonetic] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [estimated, setEstimated] = useState(false);
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [playError, setPlayError] = useState<string | null>(null);

  const tips = getTipsForWord(word);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const result = await lookupPhonetic(word);
      if (cancelled) return;

      setPhonetic(result.phonetic);
      setAudioUrl(result.audio);
      setEstimated(result.estimated);
      setStatus(result.phonetic ? "found" : "not-found");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [word]);

  function play() {
    setPlayError(null);
    if (audioUrl) {
      playDictionaryAudio(audioUrl);
    } else {
      void fallbackSpeak();
    }
  }

  function playDictionaryAudio(url: string) {
    const audio = new Audio(url);
    let started = false;
    const markStarted = () => {
      started = true;
    };
    const toFallback = () => {
      if (started) return;
      started = true;
      void fallbackSpeak();
    };
    audio.addEventListener("playing", markStarted);
    audio.addEventListener("ended", markStarted);
    audio.addEventListener("error", toFallback);
    audio.play().catch(toFallback);
    // play() can resolve without the audio ever actually starting (decode
    // stall, Chrome/macOS going quiet, etc.) -- fall back to speech
    // synthesis if we never actually hear it kick off.
    setTimeout(toFallback, PLAYBACK_START_TIMEOUT_MS);
  }

  async function fallbackSpeak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlayError("Trình duyệt không hỗ trợ phát âm thanh cho từ này.");
      return;
    }

    const voices = await waitForVoices();

    // One retry covers Chrome/macOS's speech engine needing a second nudge
    // after going quiet (tab lost focus, machine idled, etc.).
    if ((await attemptSpeak(word, voices)) === "ok") return;
    if ((await attemptSpeak(word, voices)) === "ok") return;
    setPlayError("Không phát được âm thanh. Hãy kiểm tra âm lượng máy hoặc xem tab có đang bị tắt tiếng không.");
  }

  return (
    <div className="card space-y-2 p-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-medium text-[var(--color-ink)]">{word}</span>
        <button
          onClick={play}
          className="rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-3 py-1 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        >
          ▶ Nghe
        </button>
      </div>
      <p className="text-sm text-muted">
        {status === "loading" && "Đang tra phiên âm..."}
        {status === "found" && (
          <>
            {phonetic}
            {estimated && <span className="ml-1 text-xs">(ước tính từ nguồn phụ)</span>}
          </>
        )}
        {status === "not-found" && "(không tìm thấy phiên âm ở các nguồn, dùng audio tổng hợp)"}
      </p>
      {playError && <p className="text-error text-xs">{playError}</p>}
      {tips.length > 0 && (
        <ul className="space-y-1">
          {tips.map((tip) => (
            <li key={tip} className="tip-highlight">
              {tip}
            </li>
          ))}
        </ul>
      )}
      <PronunciationRecorder word={word} />
    </div>
  );
}
