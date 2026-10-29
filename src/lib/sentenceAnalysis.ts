// AI sentence breakdown: IPA (US/UK), word-by-word part-of-speech + meaning,
// and a clause-level grammar analysis -- the same shape as a teacher's
// worked example, generated on demand for any sentence the learner pastes.

import { getAnthropicClient } from "./anthropic";
import type { SentenceAnalysisClause, SentenceAnalysisWord } from "@/types/database";

// Caps cost/latency on pathological input -- well beyond a normal sentence.
const MAX_SENTENCE_CHARS = 500;

export interface SentenceAnalysisResult {
  translation: string;
  ipaUS: string;
  ipaUK: string;
  vietnameseApprox: string;
  note: string | null;
  words: SentenceAnalysisWord[];
  clauses: SentenceAnalysisClause[];
  structurePattern: string;
  structureLegend: string;
}

const SENTENCE_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    translation: { type: "string", description: "Bản dịch tiếng Việt tự nhiên của cả câu" },
    ipaUS: { type: "string", description: "Phiên âm IPA Anh-Mỹ cho cả câu, đặt trong /.../ " },
    ipaUK: { type: "string", description: "Phiên âm IPA Anh-Anh cho cả câu, đặt trong /.../ " },
    vietnameseApprox: {
      type: "string",
      description: "Cách đọc phỏng theo âm tiếng Việt để người mới học dễ đọc theo, ví dụ 'Ai nâu đẹt-s rai-t'",
    },
    note: {
      type: "string",
      description:
        "Lưu ý quan trọng nếu có, ví dụ phân biệt từ dễ nhầm (it's vs its). Chuỗi rỗng nếu không có gì cần lưu ý.",
    },
    words: {
      type: "array",
      description: "Phân tích từng từ/cụm từ trong câu theo đúng thứ tự xuất hiện",
      items: {
        type: "object",
        properties: {
          word: { type: "string", description: "Từ hoặc cụm từ gốc trong câu, ví dụ \"it's\"" },
          ipa: { type: "string", description: "Phiên âm IPA riêng của từ này, đặt trong /.../ " },
          partOfSpeech: {
            type: "string",
            description: "Từ loại bằng tiếng Việt kèm tiếng Anh trong ngoặc, ví dụ 'Động từ (Verb)'",
          },
          meaning: { type: "string", description: "Nghĩa tiếng Việt của từ trong ngữ cảnh câu này" },
        },
        required: ["word", "ipa", "partOfSpeech", "meaning"],
        additionalProperties: false,
      },
    },
    clauses: {
      type: "array",
      description: "Chia câu thành các mệnh đề (nếu chỉ có 1 mệnh đề thì mảng có 1 phần tử)",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "Loại mệnh đề bằng tiếng Việt kèm tiếng Anh, ví dụ 'Mệnh đề chính (Main clause)'",
          },
          text: { type: "string", description: "Phần câu thuộc mệnh đề này" },
          parts: {
            type: "array",
            description: "Các thành phần ngữ pháp trong mệnh đề (chủ ngữ, động từ, bổ ngữ...)",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  description: "Vai trò ngữ pháp bằng tiếng Việt kèm tiếng Anh, ví dụ 'Chủ ngữ (Subject)'",
                },
                text: { type: "string", description: "Từ/cụm từ đảm nhận vai trò này" },
              },
              required: ["role", "text"],
              additionalProperties: false,
            },
          },
          meaning: { type: "string", description: "Nghĩa tiếng Việt của riêng mệnh đề này" },
        },
        required: ["type", "text", "parts", "meaning"],
        additionalProperties: false,
      },
    },
    structurePattern: {
      type: "string",
      description: "Công thức cấu trúc ngữ pháp tổng quát của câu, ví dụ 'S + V + that + S + V + Adj'",
    },
    structureLegend: {
      type: "string",
      description: "Giải thích các ký hiệu viết tắt trong công thức, ví dụ 'S = Subject (chủ ngữ), V = Verb (động từ)'",
    },
  },
  required: [
    "translation",
    "ipaUS",
    "ipaUK",
    "vietnameseApprox",
    "note",
    "words",
    "clauses",
    "structurePattern",
    "structureLegend",
  ],
  additionalProperties: false,
} as const;

export async function analyzeSentence(sentence: string): Promise<SentenceAnalysisResult> {
  const trimmed = sentence.trim();
  const input = trimmed.length > MAX_SENTENCE_CHARS ? trimmed.slice(0, MAX_SENTENCE_CHARS) : trimmed;

  const system =
    "Bạn là giáo viên tiếng Anh giải thích câu cho người Việt mới học. Phân tích chính xác, ngắn gọn, " +
    "dễ hiểu, dùng thuật ngữ ngữ pháp tiếng Việt kèm tiếng Anh trong ngoặc. Luôn trả lời bằng tiếng Việt.";

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: `Phân tích câu tiếng Anh sau:\n\n${input}` }],
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: SENTENCE_ANALYSIS_SCHEMA },
    },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Không nhận được kết quả phân tích từ AI.");
  }

  const parsed = JSON.parse(textBlock.text) as SentenceAnalysisResult;
  return { ...parsed, note: parsed.note?.trim() || null };
}
