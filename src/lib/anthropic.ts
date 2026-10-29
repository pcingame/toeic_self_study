import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY chưa được cấu hình. Thêm biến môi trường này vào .env.local (và Vercel) để bật chấm điểm AI.",
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}
