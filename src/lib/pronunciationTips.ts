// Rule-based pronunciation tips for Vietnamese TOEIC Speaking learners.
// Deterministic pattern matching on spelling -- no external dictionary needed.
// Rules sourced from "TOEIC Speaking - Pronunciation IPA" (Toeic Tiến Chung).

const VOICED_TH_WORDS = new Set([
  "the", "this", "that", "these", "those", "there", "their", "then", "than",
  "though", "father", "mother", "brother", "weather", "together", "smooth",
  "with", "breathe", "other", "another", "rather", "worthy", "clothes",
]);

const WH_SILENT_H_WORDS = new Set(["why", "what", "when", "where", "which", "while", "white"]);

// "-ge" endings that come from French and keep /ʒ/ instead of the usual /dʒ/.
const FRENCH_GE_WORDS = new Set([
  "beige", "garage", "genre", "rouge", "massage", "mirage", "prestige",
  "camouflage", "collage", "corsage", "sabotage", "montage",
]);

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
    test: (w) => w.endsWith("sion") || w.endsWith("sure") || FRENCH_GE_WORDS.has(w) || w === "usually",
    tip: "Âm /ʒ/ (rung, như 'gi' nhẹ): môi tròn, xì hơi, lưỡi không chạm răng. Gặp ở đuôi -sion/-sure, hoặc vài từ gốc Pháp như beige, garage, decision.",
  },
  {
    test: (w) => !FRENCH_GE_WORDS.has(w) && (/j/.test(w) || /dge$/.test(w) || /ge$/.test(w)),
    tip: "Âm /dʒ/ (như 'ch' tiếng Việt nhưng CÓ rung dây thanh): đầu lưỡi chạm sau răng trên. Nhận dạng: j, d giữa 2 nguyên âm, hoặc -dge/-ge cuối từ (joke, image).",
  },
  {
    test: (w) => /ch/.test(w) && !/ck/.test(w),
    tip: "ch phát âm /tʃ/: bật hơi mạnh, môi hơi tròn, giống 'ch' tiếng Việt nhưng có thêm hơi bật, KHÔNG rung dây thanh.",
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
    test: (w) => w.includes("f") || /gh$/.test(w),
    tip: "âm /f/: răng trên chạm nhẹ môi dưới, KHÔNG rung — so với /v/ (có rung). Chú ý 'gh' cuối từ cũng đọc /f/ (laugh).",
  },
  {
    test: (w) => /^w/.test(w) && !WH_SILENT_H_WORDS.has(w),
    tip: "âm /w/: môi tròn và đẩy ra trước, KHÔNG để răng chạm môi (khác âm /v/).",
  },
  {
    test: (w) => /^y/.test(w),
    tip: "âm /j/ ('y'): phần giữa lưỡi nhô lên gần vòm họng rồi lướt nhanh sang nguyên âm sau, không kéo dài như 'i'.",
  },
  {
    test: (w) => /^p/.test(w) || (/^t/.test(w) && !/^th/.test(w)) || (/^[ck]/.test(w) && !/^ch/.test(w)),
    tip: "p/t/k đầu từ là âm BẬT HƠI, vô thanh (không rung dây thanh): đẩy hơi ra rõ — so với b/d/g đọc nhẹ, rung ở họng, không bật hơi.",
  },
  {
    test: (w) => /^b/.test(w) || /^d/.test(w) || (/^g/.test(w) && !/^gh/.test(w)),
    tip: "b/d/g đầu từ là âm HỮU THANH (rung ở họng), hầu như KHÔNG bật hơi — so với p/t/k bật hơi mạnh, không rung.",
  },
  {
    test: (w) =>
      /[aeiouy]tt?[aeiouy]/.test(w) || /rt[aeiouy]/.test(w) || /nt[aeiouy]/.test(w) || /[^aeiouy\s]t[^aeiouy\s]/.test(w),
    tip: "Trong tiếng Anh-Mỹ, 't' đứng giữa 2 nguyên âm hoặc sau 'r' (không nhấn) thường lướt thành 'd' nhẹ (city, water); 't' đứng giữa 2 phụ âm hoặc sau 'n' thường bị lướt/im hơi (exactly, center).",
  },
  {
    test: (w) => /l$/.test(w) || /le$/.test(w),
    tip: "'l' cuối từ là Dark L: đầu lưỡi chạm trong răng dưới, cuống lưỡi kéo về sau họng, phát âm từ trong họng — môi không di chuyển (real, file).",
  },
  {
    test: (w) => !/l$/.test(w) && !/le$/.test(w) && /l[aeiouy]/.test(w),
    tip: "'l' đứng trước nguyên âm là Light L: đầu lưỡi chạm vào ngạc cứng (sau răng trên) — khác với Dark L ở cuối từ.",
  },
  {
    test: (w) => w.endsWith("ed"),
    tip: "Đuôi -ed đọc /t/ sau âm vô thanh (p,k,f,s,ʃ,tʃ: watched), /d/ sau âm hữu thanh hoặc nguyên âm (played, cleaned), và /ɪd/ chỉ khi động từ gốc tận cùng bằng t/d (wanted, ended).",
  },
  {
    test: (w) => w.endsWith("s") && !w.endsWith("ss") && w.length > 2,
    tip: "Đuôi -s/-es đọc /ɪz/ sau s,z,ʃ,ʒ,tʃ,dʒ (washes); /s/ sau âm vô thanh p,t,k,f,θ (units); /z/ sau âm hữu thanh còn lại hoặc nguyên âm (plays, hugs).",
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
    title: "Bật hơi (p/t/k) vs Không bật hơi (b/d/g)",
    body: "p, t, k là âm vô thanh, bật hơi mạnh, không rung dây thanh (pen, time, cook). b, d, g là âm hữu thanh, rung ở họng, gần như không bật hơi (bump, day, good). Đây là cặp tương phản quan trọng nhất trong phụ âm tiếng Anh.",
  },
  {
    title: "Âm TH (/θ/ và /ð/)",
    body: "Đặt lưỡi giữa hai hàm răng. /θ/ không rung (think, math), /ð/ có rung (this, father). Đây là âm không tồn tại trong tiếng Việt nên cần luyện riêng.",
  },
  {
    title: "V vs W vs F",
    body: "/v/: răng trên chạm môi dưới, có rung. /f/: giống /v/ nhưng không rung. /w/: môi tròn đẩy ra trước, không chạm răng. Ba âm này người Việt thường lẫn với nhau.",
  },
  {
    title: "Light L & Dark L",
    body: "Light L (đứng trước nguyên âm, vd: let, release): đầu lưỡi chạm ngạc cứng sau răng trên. Dark L (đứng cuối từ hoặc sau nguyên âm, vd: real, file, Google): phát âm từ trong họng, môi và lưỡi gần như không di chuyển.",
  },
  {
    title: "T lướt nhẹ kiểu Mỹ (Flap T)",
    body: "Trong tiếng Anh-Mỹ, 't' không nhấn đứng giữa 2 nguyên âm hoặc sau 'r' thường đọc lướt thành 'd' nhẹ: city nghe gần như 'sidi', water gần như 'wader'. 't' giữa 2 phụ âm hoặc sau 'n' (exactly, center) thường bị lướt/im hơi.",
  },
  {
    title: "Quy tắc đuôi -s/-es",
    body: "Đọc /ɪz/ nếu từ gốc tận cùng bằng s, z, ʃ, ʒ, tʃ, dʒ (washes). Đọc /s/ nếu tận cùng bằng âm vô thanh p, t, k, f, θ (units). Đọc /z/ với các âm hữu thanh còn lại hoặc nguyên âm (plays, hugs).",
  },
  {
    title: "Quy tắc đuôi -ed",
    body: "Đọc /t/ nếu động từ gốc tận cùng bằng âm vô thanh (watched). Đọc /d/ nếu tận cùng bằng âm hữu thanh hoặc nguyên âm (played, cleaned). Chỉ đọc /ɪd/ khi động từ gốc tận cùng bằng chính âm t hoặc d (wanted, ended).",
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

// Homework word list from "TOEIC Speaking - Pronunciation IPA" (Toeic Tiến Chung).
export const SAMPLE_WORD_LIST = {
  title: "Homework - Pronunciation IPA (Tiến Chung)",
  words: [
    "pen", "pump", "bump", "cab", "time", "best", "exactly", "day", "learned", "city",
    "teacher", "church", "joke", "image", "cook", "good", "big", "fat", "laugh", "very",
    "five", "something", "math", "the", "father", "smooth", "sea", "six", "season", "close",
    "she", "push", "decision", "beige", "miss", "nice", "man", "singer", "sing", "hit",
    "head", "let", "real", "file", "would", "water", "why", "yes", "use",
  ],
};
