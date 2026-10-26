// Rule-based pronunciation tips for Vietnamese TOEIC Speaking learners.
// Deterministic pattern matching on spelling -- no external dictionary needed.

const VOICED_TH_WORDS = new Set([
  "the", "this", "that", "these", "those", "there", "their", "then", "than",
  "though", "father", "mother", "brother", "weather", "together", "smooth",
  "with", "breathe", "other", "another", "rather", "worthy", "clothes",
]);

const WH_SILENT_H_WORDS = new Set(["why", "what", "when", "where", "which", "while", "white"]);

interface Rule {
  test: (word: string) => boolean;
  tip: string;
}

const RULES: Rule[] = [
  {
    test: (w) => w.includes("th") && VOICED_TH_WORDS.has(w),
    tip: "th phát âm /ð/ (rung dây thanh): đặt đầu lưỡi giữa hai hàm răng, đẩy hơi ra và rung nhẹ.",
  },
  {
    test: (w) => w.includes("th") && !VOICED_TH_WORDS.has(w),
    tip: "th phát âm /θ/ (không rung): đặt đầu lưỡi giữa hai hàm răng, thổi hơi ra nhưng KHÔNG rung dây thanh.",
  },
  {
    test: (w) => WH_SILENT_H_WORDS.has(w),
    tip: "wh trong tiếng Anh-Mỹ thường chỉ đọc /w/, chữ h coi như câm (ví dụ why = /waɪ/).",
  },
  {
    test: (w) => w === "would" || w === "should" || w === "could",
    tip: "Chữ l trong 'would/should/could' KHÔNG phát âm — đọc giống 'wood/shood/cood'.",
  },
  {
    test: (w) => w.endsWith("sion") || w.endsWith("sure"),
    tip: "Đuôi -sion/-sure thường phát âm /ʒ/ hoặc /ʃ/, ví dụ decision = /dɪˈsɪʒən/.",
  },
  {
    test: (w) => w === "beige" || w === "image" || w === "usually",
    tip: "Âm /ʒ/ (như 'gi' nhẹ trong 'gin' tiếng Pháp): môi tròn, rung dây thanh, không chạm lưỡi vào răng.",
  },
  {
    test: (w) => /ch/.test(w) && !/ck/.test(w),
    tip: "ch phát âm /tʃ/: bật hơi mạnh, môi hơi tròn, giống 'ch' tiếng Việt nhưng có thêm hơi bật.",
  },
  {
    test: (w) => /sh/.test(w),
    tip: "sh phát âm /ʃ/: môi tròn, đẩy ra trước, lưỡi không chạm răng (khác âm 's').",
  },
  {
    test: (w) => w.includes("v"),
    tip: "âm /v/: răng trên chạm nhẹ vào môi dưới, CÓ rung — khác với /w/ (không chạm răng).",
  },
  {
    test: (w) => /^w/.test(w) && !WH_SILENT_H_WORDS.has(w),
    tip: "âm /w/: môi tròn và đẩy ra trước, KHÔNG để răng chạm môi (khác âm /v/).",
  },
  {
    test: (w) => w.endsWith("ed"),
    tip: "Đuôi -ed phát âm /t/, /d/, hoặc /ɪd/ tùy âm cuối động từ gốc — không phải lúc nào cũng đọc 'ét'.",
  },
  {
    test: (w) => w.endsWith("s") && !w.endsWith("ss") && w.length > 2,
    tip: "Đuôi -s/-es phát âm /s/, /z/, hoặc /ɪz/ tùy âm đứng trước nó.",
  },
  {
    test: (w) => w.endsWith("ng"),
    tip: "âm /ŋ/ cuối (-ng): chỉ đọc qua mũi, KHÔNG bật thêm âm 'g' phía sau (singer ≠ sin-gơ).",
  },
  {
    test: (w) => /[bcdfgklmnpqtvxz]$/.test(w),
    tip: "Đọc rõ phụ âm cuối, không thêm nguyên âm 'ơ' phía sau — lỗi rất phổ biến của người Việt.",
  },
  {
    test: (w) => w.length >= 7,
    tip: "Từ nhiều âm tiết: chú ý nhấn đúng trọng âm (word stress), nghe audio mẫu để bắt đúng âm tiết nhấn.",
  },
];

export function getTipsForWord(word: string): string[] {
  const w = word.trim().toLowerCase();
  if (!w) return [];
  const tips = RULES.filter((r) => r.test(w)).map((r) => r.tip);
  return Array.from(new Set(tips));
}

export const GENERAL_PRONUNCIATION_TIPS: { title: string; body: string }[] = [
  {
    title: "Phụ âm cuối",
    body: "Người Việt hay bỏ qua hoặc thêm nguyên âm sau phụ âm cuối (ví dụ 'bag' đọc thành 'be-gơ'). Hãy đọc rõ và dừng hẳn ở phụ âm cuối.",
  },
  {
    title: "Âm TH (/θ/ và /ð/)",
    body: "Đặt lưỡi giữa hai hàm răng. /θ/ không rung (think, math), /ð/ có rung (this, father). Đây là âm không tồn tại trong tiếng Việt nên cần luyện riêng.",
  },
  {
    title: "V vs W",
    body: "/v/: răng trên chạm môi dưới, có rung. /w/: môi tròn đẩy ra trước, không chạm răng. Hai âm này người Việt thường lẫn với nhau.",
  },
  {
    title: "Trọng âm từ (Word Stress)",
    body: "Tiếng Anh không đọc đều các âm tiết như tiếng Việt — một âm tiết luôn được nhấn mạnh hơn. Nhấn sai trọng âm có thể khiến người nghe không hiểu từ.",
  },
  {
    title: "Nối âm (Linking)",
    body: "Khi nói câu, âm cuối của từ trước thường nối với âm đầu của từ sau (ví dụ 'turn_off' nghe như 'turnoff'). Luyện nghe và lặp lại theo audio mẫu để quen nhịp.",
  },
  {
    title: "Nguyên âm dài/ngắn",
    body: "Các cặp từ như 'sit/seat', 'full/fool' khác nhau ở độ dài nguyên âm. Đọc sai độ dài có thể đổi nghĩa cả từ.",
  },
];
