// Part 1 (Read a text aloud) theory: scoring rubric, stress rules, linking-sound rules.
// Sourced from "TOEIC Speaking - PART 1 Pronunciation & Stress" (Toeic Tiến Chung).

export const SCORING_RUBRIC: {
  score: 3 | 2 | 1 | 0;
  pronunciation: string;
  prosody: string;
}[] = [
  {
    score: 3,
    pronunciation:
      "Người nghe có thể hiểu được toàn bộ hoặc gần như toàn bộ đoạn đọc. Có lỗi nhỏ và ảnh hưởng bởi tiếng mẹ đẻ nhưng không mang tính hệ thống, rất dễ hiểu.",
    prosody: "Ngữ điệu, ngắt nghỉ, nhấn từ hoàn toàn phù hợp với nội dung đọc.",
  },
  {
    score: 2,
    pronunciation:
      "Người nghe có thể hiểu được phần lớn đoạn đọc. Có lỗi và ảnh hưởng bởi tiếng mẹ đẻ nhưng không mang tính hệ thống.",
    prosody: "Ngữ điệu, ngắt nghỉ, nhấn từ tương đối phù hợp với nội dung đọc. Có lỗi nhỏ.",
  },
  {
    score: 1,
    pronunciation:
      "Người nghe có thể hiểu được một số phần trong đoạn đọc. Có nhiều lỗi hoặc ảnh hưởng từ ngôn ngữ khác như tiếng mẹ đẻ nên không thể truyền tải chính xác đoạn văn.",
    prosody: "Ngữ điệu, ngắt nghỉ, nhấn từ không phù hợp với nội dung đọc. Có nhiều lỗi hoặc ảnh hưởng từ ngôn ngữ khác.",
  },
  {
    score: 0,
    pronunciation: "Không đọc / Đọc bằng tiếng khác / Đọc không liên quan đến đoạn cho sẵn.",
    prosody: "Không đọc / Đọc bằng tiếng khác / Đọc không liên quan đến đoạn cho sẵn.",
  },
];

export const SCORE_3_3_PILLARS = ["Pronunciation", "Emphasis", "Intonation", "Pause"];

export const STRESS_HOW_TO: { factor: string; direction: string }[] = [
  { factor: "Pitch", direction: "Lên giọng cao hơn" },
  { factor: "Length", direction: "Kéo dài âm hơn" },
  { factor: "Volume", direction: "Đọc to hơn" },
  { factor: "Vowel", direction: "Phát âm đầy đủ, rõ nguyên âm" },
];

export const STRESS_WORD_EXAMPLES: { word: string; ipa: string }[] = [
  { word: "simple", ipa: "ˈsɪmpl" },
  { word: "amazing", ipa: "əˈmeɪzɪŋ" },
  { word: "accurate", ipa: "ˈækjərət" },
  { word: "impossible", ipa: "ɪmˈpɑːsəbl" },
];

export const STRESSED_WORD_TYPES: { type: string; detail: string }[] = [
  { type: "Content words (từ mang nội dung)", detail: "Nouns, Adjectives, Verbs, Adverbs" },
  { type: "Question words (từ để hỏi)", detail: "Who, What, Which,..." },
  { type: "Negative words (từ phủ định)", detail: "No, Not, Never, Neither,..." },
  { type: "Prepositions in Phrasal Verbs (giới từ trong cụm động từ)", detail: "look after,..." },
  { type: "Quantifiers (từ chỉ số lượng)", detail: "All, A lot of, lots of, little,..." },
];

export const UNSTRESSED_WORD_TYPES: { type: string; detail: string }[] = [
  { type: "Pronouns (đại từ)", detail: "I, you, we, they, he, she, it,..." },
  { type: "Prepositions (giới từ)", detail: "in, on, at, for,..." },
  { type: "Articles (mạo từ)", detail: "a, an, the" },
  { type: "Conjunctions (từ nối)", detail: "although, because, if, since, and,.." },
  { type: "Auxiliary verbs (trợ động từ)", detail: "do, does, did, is, are,..." },
  { type: "Modal verbs (động từ khuyết thiếu)", detail: "can, could, should,.." },
];

export const STRESS_EXCEPTIONS: string[] = [
  "Khi cần nhấn mạnh, dụng ý thì vẫn nhấn vào Function Words.",
  "Khi Function Words ở cuối ý.",
  "CONTRAST: đối lập — vốn là Function Words nhưng khi đối lập vẫn nhấn mạnh.",
  "Khi được nhắc lại, là thông tin cũ thì không nhấn mạnh.",
];

export const LINKING_RULES: { title: string; note?: string; examples: { text: string; ipa: string }[] }[] = [
  {
    title: "1. Consonant + Vowel",
    examples: [
      { text: "give it a try", ipa: "ɡɪv ɪt ə traɪ" },
      { text: "can I?", ipa: "kæn aɪ" },
      { text: "with us", ipa: "wɪð ʌs" },
      { text: "call us", ipa: "kɔːl əs" },
      { text: "hold on", ipa: "həʊld ɒn" },
      { text: "turn over", ipa: "tɜːn ˈəʊvə" },
    ],
  },
  {
    title: "2. Consonant + Consonant",
    examples: [
      { text: "has she", ipa: "hæz ʃiː" },
      { text: "send me", ipa: "sɛnd miː" },
      { text: "attend the", ipa: "əˈtɛnd ðə" },
      { text: "don't know", ipa: "dəʊnt nəʊ" },
      { text: "just stop", ipa: "ʤʌst stɒp" },
      { text: "ask me", ipa: "ɑːsk miː" },
    ],
  },
  {
    title: "3. t/d/s/z + y",
    note: "/t/ + /j/ = /tʃ/ · /d/ + /j/ = /dʒ/ · /s/ + /j/ = /ʃ/ · /z/ + /j/ = /ʒ/",
    examples: [
      { text: "let you", ipa: "lɛt juː → lɛʧuː" },
      { text: "did you", ipa: "dɪd juː → dɪʤuː" },
      { text: "miss you", ipa: "mɪs juː → mɪʃuː" },
      { text: "could you", ipa: "kʊd juː → kʊʤuː" },
      { text: "get you", ipa: "ɡɛt juː → ɡɛʧuː" },
    ],
  },
  {
    title: "4. Consonant + have/her/him/the/them...",
    examples: [
      { text: "love her", ipa: "lʌv hɜr" },
      { text: "send them", ipa: "sɛnd ðɛm" },
      { text: "asked him", ipa: "æskt hɪm" },
      { text: "in the", ipa: "ɪn ðə" },
    ],
  },
  {
    title: "5. Vowel + Vowel",
    note: "Từ trước kết thúc bằng nguyên âm tròn môi (ou, u, au,...) → thêm /w/. Từ trước kết thúc bằng nguyên âm dài môi (e, i, ei,...) → thêm /j/.",
    examples: [
      { text: "do it", ipa: "duː(w) ɪt" },
      { text: "I ask", ipa: "aɪ(j) æsk" },
    ],
  },
];

export const SELF_STUDY_STEPS: string[] = [
  "Bước 1: Tra từ điển oxfordlearnersdictionaries.com để tra phiên âm từng từ riêng lẻ, hoặc tra phiên âm cả câu bằng tophonetics.com — copy cả câu vào để xem phiên âm từng từ, biết rõ trọng âm, tập đọc lại từ chưa biết hoặc từng phát âm sai.",
  "Bước 2: Xác định cần đọc to, rõ vào NHỮNG TỪ NÀO trong câu (tra từ điển để biết từ loại, dựa vào lý thuyết stress để xác định), chú ý từ khó.",
  "Bước 3: Đoán xem từ nào sẽ NỐI với từ nào trong cụm (dựa vào quy tắc nối âm), và đoán nối như nào — tự tập đọc những đoạn nối.",
  "Bước 4: Tự đọc theo phiên bản của mình CHẬM RÃI, CẨN THẬN và ghi âm lại.",
  "Bước 5: Nghe băng mẫu và sửa theo băng mẫu, take note những chỗ sai để không sai nữa (nếu gặp khó khăn nên hỏi giáo viên ngay), sau đó tập đọc thật kỹ thuộc làu làu.",
];

export const SAMPLE_READINGS: { title: string; text: string }[] = [
  {
    title: "Mẫu nhấn trọng âm (từ khóa in đậm)",
    text:
      "I **know** that it's **right**. **Tom** has **gone** to **work**. **Tell** him I'll **call** him **later**. **Tell** her **hello** for me. **Who** was at the conference? - I **was**. **As** **soon** **as** **possible**.",
  },
  {
    title: "HealthFirst Pharmacy (tổng đài tự động)",
    text:
      "Thank you for calling HealthFirst Pharmacy. To refill a prescription, press 1. To consult with our pharmacist, press 2. To inquire about over-the-counter products such as vitamins, allergy medications, or pain relievers, press 3. For all other inquiries, please stay on the line, and our team will assist you shortly.",
  },
  {
    title: "Bài tập về nhà — Chicago News (// = ngắt nghỉ dài, / = ngắt nghỉ ngắn, in đậm = nhấn)",
    text:
      "**Good evening**!// **This** is the **eleven o'clock Chicago News**.// In **tonight's news broadcast**,/ we will **cover**/ the **mayoral election campaign**, /the **opening ceremony** of the **new city hall**,/ and our **city high school's baseball games**.// But **first**,/ **let's go** to **Rachel Carson**/ for our **traffic report**!//",
  },
];
