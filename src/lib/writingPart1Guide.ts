// Part 1 (Write a sentence based on a picture) theory: exam structure, scoring rubric,
// sentence patterns, writing process, exam tips, connector grammar.
// Sourced from "TOEIC Writing" slide decks LS 1-3 (Toeic Tiến Chung).

export const EXAM_INFO = {
  questions: "5 câu, mỗi câu kèm 1 bức tranh và 2 từ cho sẵn",
  wordTypes: "2 từ cho sẵn có thể là danh từ, động từ, tính từ, giới từ, hoặc liên từ",
  time: "Tổng 8 phút cho 5 câu",
};

export const SCORING_RUBRIC: { score: 3 | 2 | 1 | 0; detail: string }[] = [
  {
    score: 3,
    detail: "Câu văn hoàn chỉnh, sử dụng từ vựng và ngữ pháp chính xác, phản ánh chính xác nội dung bức tranh.",
  },
  {
    score: 2,
    detail: "Câu văn cơ bản đúng ngữ pháp và sử dụng từ hợp lý, nhưng có thể không mô tả toàn diện nội dung.",
  },
  {
    score: 1,
    detail: "Câu có lỗi ngữ pháp hoặc không sử dụng từ cho sẵn một cách hợp lý, hoặc chỉ mô tả được một phần nội dung.",
  },
  {
    score: 0,
    detail: "Câu không đáp ứng yêu cầu, hoặc có lỗi nghiêm trọng về ngữ pháp và không mô tả đúng bức tranh.",
  },
];

export const MAX_SCORE_CRITERIA: string[] = [
  "Đúng ngữ pháp",
  "Các từ cho sẵn được sử dụng thích hợp (không cần giữ nguyên dạng như đề bài)",
  "Nội dung của câu văn có liên quan đến bức ảnh đã cho",
];

export const WRITING_STEPS: { title: string; detail: string }[] = [
  {
    title: "Bước 1: Xác định hai từ cho sẵn",
    detail:
      "Dịch nghĩa 2 từ đó và tìm xem 2 từ ở đâu trong tranh: người, vật, hành động hay vị trí.",
  },
  {
    title: "Bước 2: Quan sát bức tranh và phân tích",
    detail:
      "Tìm đối tượng chính (người/vật/cảnh nổi bật nhất), xác định hành động (nếu có người: đứng, ngồi, đọc, nhìn...), và xem xét vị trí giữa các đối tượng.",
  },
  {
    title: "Bước 3: Đặt câu hoàn chỉnh",
    detail:
      "Chủ ngữ + Động từ + (Tân ngữ) + (Trạng ngữ). Chủ ngữ: ai/cái gì (a man, some pictures). Động từ: đang làm gì / bị tác động thế nào (is reading, are placed). Tân ngữ: đối tượng nhận hành động (a newspaper). Trạng ngữ: nơi chốn/thời gian/cách thức (on the table).",
  },
  {
    title: "Bước 4: Kiểm tra lại câu",
    detail:
      "Ngữ pháp (chia V, số ít/số nhiều/mạo từ, giới từ), có đủ cả hai từ cho sẵn, và mô tả đúng nội dung bức tranh.",
  },
];

export const SENTENCE_PATTERNS: { pattern: string; examples: string[] }[] = [
  { pattern: "S + V", examples: ["Customers often complain.", "Staff members resigned unexpectedly last month."] },
  {
    pattern: "S + V + O",
    examples: [
      "The company launched a new marketing campaign.",
      "They held a training session for new employees.",
    ],
  },
  {
    pattern: "S + V + C",
    examples: ["Customer satisfaction is very important for business success.", "The financial report seems accurate."],
  },
  {
    pattern: "S + V + O + C",
    examples: ["The manager appointed him the team leader.", "The board members considered the project a success."],
  },
  {
    pattern: "S + V + O1 + O2 (hoặc S + V + O2 + to/for + O1)",
    examples: ["The project coordinator assigned her a task.", "They offered a discount to customers."],
  },
];

export const GENERAL_WRITING_PROCESS: string[] = [
  "Bước 1: Xác định nghĩa tiếng Việt muốn truyền đạt.",
  "Bước 2: Chia nhỏ nghĩa câu thành S (ai/cái gì làm), V (làm gì), O (làm gì với ai/cái gì), C (mô tả cho S hoặc O).",
  "Bước 3: Đặt câu dựa theo động từ — S luôn đứng trước, V ngay sau S, O đứng sau V, C đứng sau V hoặc O.",
  "Bước 4: Thêm chi tiết mô tả nếu muốn chi tiết hơn — nơi chốn (in the kitchen), thời gian (every morning), cách thức (quickly).",
  "Bước 5: Xem lại cấu trúc ngữ pháp — V đã chia đúng thì/số ít-nhiều/chủ động-bị động chưa, danh từ đã đúng số ít/số nhiều/không đếm được chưa, và sự kết hợp động từ/tính từ/danh từ với giới từ đã đúng chưa.",
];

export const EXAM_TIPS: string[] = [
  "Nên viết câu ngắn và đơn giản. Không cộng điểm nhiều hơn cho các câu viết dài hơn.",
  "Nếu gặp tranh chưa nghĩ được đáp án thì nên chuyển qua làm tranh khác rồi quay lại sau.",
  "Dành 5 phút để viết 5 câu miêu tả, còn lại 3 phút để soát lại kỹ từng câu.",
  "Tranh tả người nên chia V ở hiện tại tiếp diễn: is/are + V-ing.",
  "Tranh không có người: chia V ở bị động hiện tại đơn (is/are + V-ed/c3), hoặc dùng There is/are + đồ vật + cụm giới từ.",
];

export const CONNECTOR_GRAMMAR: { title: string; note: string; examples: string[] }[] = [
  {
    title: "Now that (bây giờ thì, vì)",
    note: "Now that + mệnh đề chỉ lý do/nguyên nhân mới xuất hiện, nhấn mạnh một tình huống mới xảy ra. Khác với So that (để, để mà) + mệnh đề chỉ mục đích.",
    examples: [
      "Now that the meeting is over, the men are shaking hands.",
      "Now that I have a car, I can drive to work.",
      "I bought a car so that I could drive to work.",
    ],
  },
  {
    title: "Although ~ Though ~ Even though (mặc dù)",
    note: "Theo sau là một mệnh đề đầy đủ (S + V), không dùng chung với \"but\" trong cùng một câu.",
    examples: [
      "The person is walking barefoot, although there is snow on the ground.",
      "Even though it is raining, a woman is standing outside.",
      "Even though there is heavy rain, a woman is outside with an umbrella.",
    ],
  },
  {
    title: "While, when, before, after + V-ing",
    note: "Dùng khi chủ ngữ là cùng một người và hai hành động xảy ra đồng thời.",
    examples: [
      "The man is writing while talking on the phone.",
      "The man is working at the desk while holding a phone.",
      "People are riding horses while it is snowing.",
    ],
  },
  {
    title: "If + S + V (hiện tại đơn), S + will + V — câu điều kiện loại 1",
    note: "Diễn tả việc có thể xảy ra ở hiện tại hoặc tương lai.",
    examples: ["If the shoes fit, the woman will buy them.", "If the manager arrives early, we will start the meeting."],
  },
  {
    title: "In order to + V (để)",
    note: "Diễn tả mục đích của hành động.",
    examples: [
      "A woman is opening a cupboard in order to get a cup.",
      "The woman is opening the door in order to get a drink.",
    ],
  },
];

export const SAMPLE_CORRECTIONS: { wordPair: string; before: string; after: string }[] = [
  {
    wordPair: "merchandise / rack",
    before: "Many merchandises are displayed on the racks.",
    after: "Various merchandise is displayed on the racks.",
  },
  {
    wordPair: "parasol / next to",
    before: "There are a beach chair next to the parasol.",
    after: "There is a beach chair next to the parasol.",
  },
  {
    wordPair: "on / above / below / next to",
    before: "A lamp is placed in the floor.",
    after: "A lamp is placed on the floor. There is a picture above the chair.",
  },
  {
    wordPair: "cart / next to",
    before: "The car is parking next to several shopping carts.",
    after: "The car is parked next to several luggage carts.",
  },
  {
    wordPair: "child / with",
    before: "The children is holding the bar.",
    after: "The child with a hat is holding the bar.",
  },
  {
    wordPair: "truck / bridge",
    before: "A truck is passing in the bridge.",
    after: "There is a bridge over a river. The truck is moving along the bridge.",
  },
  {
    wordPair: "woman / and",
    before: "A woman and a man is studying together.",
    after: "A woman and a man are studying together.",
  },
  {
    wordPair: "golf / but",
    before: "One man play golf, but the others just watching.",
    after: "One man is playing golf, but the others are just watching.",
  },
  {
    wordPair: "now that / shake",
    before: "Now that the meeting is over, the men is shaking hand.",
    after: "Now that the meeting is over, the men are shaking hands.",
  },
  {
    wordPair: "barefoot / although",
    before: "Although it is snow, but this person is walking barefoot.",
    after: "Although it is snowy, this person is walking barefoot.",
  },
  {
    wordPair: "while / phone",
    before: "The man is writing while talk on the phone.",
    after: "The man is writing while talking on the phone.",
  },
  {
    wordPair: "if / fit",
    before: "If the shoe fits, the woman buy them.",
    after: "If the shoes fit, the woman will buy them.",
  },
  {
    wordPair: "open / in order to",
    before: "A woman is opening cupboard in order to a cup.",
    after: "A woman is opening a cupboard in order to get a cup.",
  },
  {
    wordPair: "luggage / because",
    before: "People are waiting luggages because their plane landed.",
    after: "People are waiting for luggage because their plane landed.",
  },
  {
    wordPair: "table / and",
    before: "A table and some plants is in the room.",
    after: "A table and some plants are in the room.",
  },
  {
    wordPair: "watch / while",
    before: "A man is watching while the other are working.",
    after: "A man is watching while the others are working.",
  },
  {
    wordPair: "ride / while",
    before: "People rides horse while it is snow.",
    after: "People are riding horses while it is snowing.",
  },
  {
    wordPair: "show / how",
    before: "A woman show the other how to using the laptop.",
    after: "A woman is showing the other how to use the laptop.",
  },
  {
    wordPair: "decide / if",
    before: "The man is deciding if he should goes inside.",
    after: "The man is deciding if he should go inside.",
  },
  {
    wordPair: "cart / because",
    before: "The man is using cart because the items heavy.",
    after: "The man is using a cart because the items are heavy.",
  },
  {
    wordPair: "bus / before",
    before: "(ghép 3 ý rời rạc)",
    after:
      "A man is checking tickets before the bus. The people are waiting in line before boarding the bus.",
  },
];
