// AI grading for Writing/Speaking attempts against TOEIC scoring rubrics.
// Speaking is graded from a transcript (captured client-side via the Web
// Speech API) rather than audio -- the Claude Messages API takes text/image/
// PDF input, not audio, so pronunciation/intonation can't be judged this way.
// Part 1 Speaking (read aloud) feedback is scoped to completeness/fluency and
// explicitly tells the user to self-check pronunciation against the guide.

import { getAnthropicClient } from "./anthropic";
import type { GradeResult } from "@/types/database";

export type ExamType = "writing" | "speaking";

function writingMaxScore(part: number): number {
  if (part <= 1) return 3;
  if (part === 2) return 4;
  return 5;
}

function speakingMaxScore(part: number, groupLabel: string): number {
  if (part === 5 && /opinion/i.test(groupLabel)) return 5;
  return 3;
}

const WRITING_RUBRIC_TEXT: Record<number, string> = {
  1: "Thang điểm 0-3 (viết câu từ tranh, dùng 2 từ cho sẵn). 3: câu hoàn chỉnh, đúng ngữ pháp, dùng đúng và tự nhiên cả 2 từ cho sẵn (được phép đổi dạng từ), mô tả đúng nội dung bức tranh. 2: câu cơ bản đúng ngữ pháp và dùng được 2 từ, nhưng có thể chưa mô tả đầy đủ nội dung. 1: có lỗi ngữ pháp, hoặc dùng sai/thiếu một trong hai từ cho sẵn, hoặc chỉ mô tả được một phần nội dung. 0: không đáp ứng yêu cầu, bỏ trống, hoặc không liên quan đến bức tranh.",
  2: "Thang điểm 0-4 (trả lời email). Đánh giá: câu văn đa dạng và đúng ngữ pháp, từ vựng phù hợp với ngữ cảnh công việc/email, bố cục rõ ràng (chào hỏi - nội dung - kết), và trả lời đầy đủ tất cả các yêu cầu nêu trong đề (ví dụ đủ số lý do/câu hỏi được yêu cầu).",
  3: "Thang điểm 0-5 (bài luận nêu ý kiến). Đánh giá: nêu rõ quan điểm (đồng ý/không đồng ý/lựa chọn), lập luận có lý lẽ và ví dụ cụ thể hỗ trợ, bố cục rõ ràng (mở bài - thân bài - kết bài), ngữ pháp và từ vựng đa dạng, chính xác, độ dài và nội dung tương xứng với yêu cầu đề bài.",
};

function speakingRubricText(part: number, groupLabel: string): string {
  if (part === 1) {
    return "Thang điểm 0-3 (đọc to đoạn văn cho sẵn). Bản ghi dưới đây là transcript do nhận diện giọng nói (Web Speech API) tạo ra — CHỈ phản ánh nội dung đọc được, KHÔNG phản ánh phát âm/ngữ điệu/trọng âm thực tế. Chấm dựa trên: transcript có khớp đầy đủ, đúng thứ tự với đoạn văn gốc không (thiếu từ, thừa từ, đọc sai/nhảy từ), và dấu hiệu gián đoạn/ấp úng nếu có. Trong phần nhận xét, LUÔN nhắc người học tự nghe lại bản ghi âm và đối chiếu hướng dẫn phát âm để tự đánh giá phần phát âm/ngữ điệu, vì phần đó không thể chấm qua văn bản.";
  }
  if (part === 2) {
    return "Thang điểm 0-3 (mô tả tranh). Đánh giá nội dung transcript: mô tả có đúng, đủ, hợp lý với bức tranh (dựa trên mô tả tranh bằng chữ của đề bài) không, ngữ pháp, từ vựng, sự mạch lạc.";
  }
  if (part === 3) {
    return "Thang điểm 0-3 (trả lời câu hỏi khảo sát). Đánh giá: câu trả lời có đúng trọng tâm câu hỏi, nội dung hợp lý/liên quan, ngữ pháp và từ vựng, độ đầy đủ so với thời gian được phép nói.";
  }
  if (part === 4) {
    return "Thang điểm 0-3 (trả lời dựa trên thông tin cho sẵn). Đánh giá: có dùng đúng và đủ thông tin trong đề (lịch trình/bảng biểu/voicemail...) để trả lời không, ngữ pháp, từ vựng, độ liên quan.";
  }
  if (/opinion/i.test(groupLabel)) {
    return "Thang điểm 0-5 (nêu ý kiến). Đánh giá: nêu rõ quan điểm và lý do thuyết phục, lập luận có ví dụ/giải thích cụ thể, tổ chức ý rõ ràng, ngữ pháp và từ vựng đa dạng, độ đầy đủ so với thời gian nói.";
  }
  return "Thang điểm 0-3 (đề xuất giải pháp). Đánh giá: có thể hiện hiểu đúng vấn đề được nêu và đề xuất giải pháp hợp lý, khả thi không, ngữ pháp, từ vựng, tổ chức ý.";
}

const GRADING_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "Điểm số nguyên, từ 0 đến điểm tối đa của phần này" },
    strengths: { type: "string", description: "1-2 câu tiếng Việt nêu điểm tốt trong bài làm" },
    improvements: {
      type: "string",
      description: "2-4 câu tiếng Việt, chỉ ra lỗi cụ thể (trích từ/câu nếu có) và cách sửa",
    },
  },
  required: ["score", "strengths", "improvements"],
  additionalProperties: false,
} as const;

interface GradeInput {
  examType: ExamType;
  part: number;
  groupLabel: string;
  promptText: string;
  context: string | null;
  answerText: string;
}

export async function gradeAnswer(input: GradeInput): Promise<GradeResult> {
  const maxScore =
    input.examType === "writing"
      ? writingMaxScore(input.part)
      : speakingMaxScore(input.part, input.groupLabel);

  const rubric =
    input.examType === "writing"
      ? WRITING_RUBRIC_TEXT[Math.min(input.part, 3)]
      : speakingRubricText(input.part, input.groupLabel);

  const system =
    `Bạn là giám khảo chấm thi TOEIC ${input.examType === "writing" ? "Writing" : "Speaking"}. ` +
    "Chấm nghiêm túc, công bằng, bám sát tiêu chí được cung cấp. Luôn trả lời bằng tiếng Việt, ngắn gọn, cụ thể, mang tính xây dựng, không khen chung chung.";

  const user = [
    `Tiêu chí chấm: ${rubric}`,
    `Đề bài: ${input.promptText}`,
    input.context ? `Yêu cầu thêm: ${input.context}` : null,
    `Bài làm của thí sinh:\n${input.answerText}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: user }],
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: GRADING_SCHEMA },
    },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Không nhận được phản hồi chấm điểm từ AI.");
  }

  const parsed = JSON.parse(textBlock.text) as { score: number; strengths: string; improvements: string };
  const score = Math.max(0, Math.min(maxScore, Math.round(parsed.score)));

  return { score, maxScore, strengths: parsed.strengths, improvements: parsed.improvements };
}
