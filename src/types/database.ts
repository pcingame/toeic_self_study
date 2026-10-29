export type WritingPart = 1 | 2 | 3;
export type SpeakingPart = 1 | 2 | 3 | 4 | 5;
export type SessionType = "writing_full" | "speaking_full" | "single";

export interface WritingQuestion {
  id: string;
  part: WritingPart;
  group_label: string;
  order_index: number;
  prompt_text: string;
  context: string | null;
  image_url: string | null;
  time_limit_sec: number;
  created_at: string;
}

export interface SpeakingQuestion {
  id: string;
  part: SpeakingPart;
  group_label: string;
  order_index: number;
  prompt_text: string;
  image_url: string | null;
  audio_prompt_url: string | null;
  prep_time_sec: number;
  speak_time_sec: number;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  type: SessionType;
  started_at: string;
  completed_at: string | null;
}

export interface WritingAttempt {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string | null;
  answer_text: string;
  started_at: string;
  submitted_at: string | null;
  duration_sec: number | null;
  score: number | null;
  max_score: number | null;
  feedback: string | null;
  graded_at: string | null;
}

export interface SpeakingAttempt {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string | null;
  audio_path: string | null;
  started_at: string;
  submitted_at: string | null;
  duration_sec: number | null;
  transcript: string | null;
  score: number | null;
  max_score: number | null;
  feedback: string | null;
  graded_at: string | null;
}

export interface GradeResult {
  score: number;
  maxScore: number;
  strengths: string;
  improvements: string;
}

export interface PronunciationList {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface PronunciationItem {
  id: string;
  list_id: string;
  user_id: string;
  word: string;
  order_index: number;
}
