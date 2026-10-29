// Minimal typings for the (non-standard, Chrome-only) Web Speech API, shared
// across every component that uses it. Each `declare global` augmentation of
// `Window` must agree on the exact member types, so this lives in one place
// rather than being redeclared per-file.

export interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence?: number;
}
export interface SpeechRecognitionResultLike {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}
export interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResultLike };
}
export interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  maxAlternatives: number;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
