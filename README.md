# TOEIC Self-Study — Writing & Speaking

Web tự ôn luyện TOEIC Writing (8 câu) & Speaking (11 câu), đúng format và thời gian thi thật, lưu bài làm trên server để xem lại từ bất kỳ thiết bị nào.

## Tech Stack

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| Framework | **Next.js 16** (App Router) | React Server Components + Server Actions, không có API route riêng cho phần lớn nghiệp vụ |
| UI | **React 19** | `useFormStatus`, Server Components mặc định, `"use client"` chỉ ở nơi cần tương tác (recorder, composer, theme toggle...) |
| Ngôn ngữ | **TypeScript 5** | Strict mode, kiểu dữ liệu DB định nghĩa tay tại `src/types/database.ts` |
| Styling | **Tailwind CSS v4** (`@tailwindcss/turbopack`) | Thiết kế riêng (ink/violet theme), dark mode qua `data-theme` + `prefers-color-scheme`, font `Fraunces` (display) + `Geist` (sans/mono) |
| Backend/DB | **Supabase** (Postgres) | Toàn bộ dữ liệu nghiệp vụ: câu hỏi, bài làm, danh sách phát âm, phiên luyện full-test |
| Auth | **Supabase Auth** (email/password) | Qua `@supabase/ssr`, session giữ bằng cookie, kiểm tra trong middleware |
| File storage | **Supabase Storage** | Bucket `speaking-recordings` (private, RLS theo `user_id`) lưu file ghi âm Speaking |
| Bảo mật dữ liệu | **Row Level Security (RLS)** | Mỗi bảng user-owned đều có policy `auth.uid() = user_id`; câu hỏi (`*_questions`) chỉ cần `authenticated` để đọc |
| Hosting | **Vercel** | Next.js server components + server actions chạy serverless |
| API ngoài | `dictionaryapi.dev`, `api.datamuse.com`, **Claude API** (`claude-sonnet-5`) | Tra phiên âm IPA (fallback ARPAbet khi từ hiếm); chấm điểm AI cho bài Writing/Speaking theo tiêu chí TOEIC (structured output, trả JSON điểm + nhận xét) |
| API trình duyệt | Web Speech API, MediaRecorder API | Chấm điểm phát âm (SpeechRecognition) và ghi âm Speaking (MediaRecorder), chạy hoàn toàn client-side |
| Lưu trữ phụ | `localStorage` | Lịch sử điểm phát âm theo từng từ (không cần bảng DB riêng) |

### Kiến trúc chính

- **App Router + Server Components**: hầu hết các trang (`/`, `/writing`, `/speaking`, `/history`, các trang guide...) là Server Component, fetch dữ liệu trực tiếp từ Supabase lúc render, không cần client-side fetching hay API route trung gian.
- **Server Actions**: mọi thao tác ghi dữ liệu dùng server action (`"use server"`) thay vì route handler riêng — đăng nhập/đăng ký/đổi mật khẩu (`src/app/login/actions.ts`), tạo/kết thúc phiên full-test (`src/app/full-test/actions.ts`), tạo/xoá danh sách phát âm (`src/app/pronunciation/actions.ts`).
- **Middleware bảo vệ route** (`src/lib/supabase/middleware.ts`): các path không nằm trong danh sách public (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`) đều yêu cầu đăng nhập; chưa đăng nhập sẽ bị redirect về `/login?next=<đường-dẫn-gốc>` để quay lại đúng trang sau khi đăng nhập.
- **Seed data tách biệt theo nhóm**: câu hỏi "chính thức" (đúng số thứ tự 1-11 Speaking / 1-8 Writing như đề thi thật) và câu hỏi "ôn thêm" (group riêng, `order_index` từ 100 trở lên) nằm chung bảng nhưng không làm xáo trộn số thứ tự mô phỏng đề thi.

## Tính năng

### Xác thực (Auth)
- Đăng ký / đăng nhập bằng email + mật khẩu (Supabase Auth).
- Xác nhận email qua link (tuỳ cấu hình project Supabase).
- Quên mật khẩu → gửi email đặt lại mật khẩu → trang `/reset-password` để đặt mật khẩu mới.
- Redirect về đúng trang đang truy cập sau khi đăng nhập (không bị đẩy về trang chủ).
- Thông báo lỗi dịch sang tiếng Việt (sai mật khẩu, email đã tồn tại, chưa xác nhận email...).
- Nút submit hiển thị trạng thái loading, chặn bấm gửi 2 lần.

### Tổng quan (`/`)
- Thống kê số câu Writing/Speaking đã luyện trên tổng số câu, số lượt làm bài.
- Danh sách hoạt động gần đây (bài Writing/Speaking mới nhất).
- Lối vào nhanh tới 6 khu vực chính: Writing, Speaking, Phát âm, Phân tích câu, Full Test, Lịch sử.

### Luyện Writing (`/writing`)
- **Part 1** — Viết câu mô tả tranh dùng 2 từ cho sẵn (5 câu chính thức + bộ câu "ôn thêm" lấy từ tài liệu TOEIC Tiến Chung).
- **Part 2** — Trả lời email (2 câu, 10 phút/câu).
- **Part 3** — Luận nêu ý kiến (1 câu, 30 phút).
- Đồng hồ đếm giờ riêng theo cấu hình từng câu (`time_limit_sec` trong DB).
- Lưu bài làm (text) vào Supabase, có thể xem lại ở `/history`.
- **Chấm điểm AI**: ngay sau khi nộp bài, server action gửi bài làm cho Claude chấm theo đúng thang điểm từng Part (0-3 / 0-4 / 0-5), trả về điểm + nhận xét ưu điểm/lỗi cụ thể bằng tiếng Việt, lưu lại để xem ở `/history`.
- **Trang hướng dẫn Part 1** (`/writing/part1-guide`): tiêu chí chấm điểm, 5 mẫu câu cơ bản (S+V, S+V+O, S+V+C, S+V+O+C, S+V+O1+O2), quy trình 4 bước viết câu tả tranh, quy trình 5 bước đặt câu từ ý tiếng Việt, mẹo làm bài, ngữ pháp liên từ hay gặp (now that, although/though, while/when/before/after + V-ing, if loại 1, in order to), và hơn 20 ví dụ lỗi sai → sửa.

### Luyện Speaking (`/speaking`)
- **Part 1** — Đọc to đoạn văn (2 câu chính thức + bộ "ôn thêm").
- **Part 2** — Mô tả tranh.
- **Part 3** — Trả lời câu hỏi khảo sát (3 câu).
- **Part 4** — Trả lời dựa trên thông tin cho sẵn (3 câu, dùng chung thời gian chuẩn bị).
- **Part 5** — Đề xuất giải pháp / Nêu ý kiến (2 câu).
- Ghi âm trực tiếp trên trình duyệt (MediaRecorder), có pha chuẩn bị (prep) → ghi âm (recording) → nghe lại & lưu (review).
- Xử lý lỗi micro chi tiết (bị chặn quyền, không tìm thấy thiết bị, thiết bị bị app khác chiếm, trình duyệt không hỗ trợ, ghi âm bị treo khi dừng...).
- Tải file ghi âm lên Supabase Storage (bucket riêng tư theo user), lưu attempt vào DB, nghe lại ở `/history`.
- **Chấm điểm AI**: trong lúc ghi âm, trình duyệt đồng thời chạy Web Speech API để tạo transcript; sau khi lưu bài, transcript được gửi cho Claude chấm theo tiêu chí TOEIC Speaking từng Part, trả điểm + nhận xét. Part 1 (đọc to đoạn văn) chỉ chấm được độ khớp nội dung qua transcript — phát âm/ngữ điệu cần tự nghe lại và đối chiếu hướng dẫn.
- **Trang hướng dẫn Part 1** (`/speaking/part1-guide`): tiêu chí chấm điểm (phát âm / ngữ điệu-ngắt nghỉ-nhấn), cách nhấn trọng âm, từ cần nhấn vs. không nhấn (và ngoại lệ), 5 quy tắc nối âm có ví dụ IPA, quy trình 5 bước tự học chủ động, mẫu bài đọc có đánh dấu nhấn/ngắt.

### Phát âm (`/pronunciation`)
- Dán một danh sách từ tiếng Anh bất kỳ → tự động tra phiên âm IPA + audio chuẩn (dictionaryapi.dev, fallback Datamuse/ARPAbet khi từ không có trong dictionaryapi.dev).
- Gợi ý mẹo phát âm theo quy tắc (âm TH, V/W/F, Light L/Dark L, flap T kiểu Mỹ, đuôi -s/-ed, trọng âm...) dựa trên pattern-matching chính tả từ, không cần gọi AI.
- Lưu nhiều danh sách từ, xoá danh sách (có xác nhận trước khi xoá).
- Ghi âm đọc từng từ, **Web Speech API** nhận dạng giọng nói và chấm điểm độ chính xác phát âm (0-100, thuật toán Levenshtein so khớp với phiên bản nghe được tốt nhất trong các alternative).
- Lưu lịch sử điểm theo từng từ ở `localStorage` (điểm tốt nhất, số lần luyện, mốc "đã thành thạo" ≥ 70 điểm) — không cần bảng DB riêng.
- Thanh tiến độ theo từng danh sách (bao nhiêu % từ đã đạt ngưỡng thành thạo).

### Phân tích câu (`/sentence-analysis`)
- Dán một câu tiếng Anh bất kỳ → Claude phân tích và trả về: IPA (Anh-Mỹ + Anh-Anh), cách đọc phỏng âm tiếng Việt, dịch nghĩa cả câu.
- Bảng phân tích từng từ: phiên âm, từ loại, nghĩa trong ngữ cảnh câu.
- Phân tích cấu trúc ngữ pháp theo từng mệnh đề (chủ ngữ/động từ/bổ ngữ...), công thức cấu trúc tổng quát (vd `S + V + that + S + V + Adj`) kèm chú giải ký hiệu.
- Lưu lại từng câu đã phân tích để xem lại hoặc xoá (có xác nhận trước khi xoá).

### Full Test (`/full-test`)
- Làm liên tục toàn bộ đề Writing (8 câu, ~60 phút) hoặc Speaking (11 câu, ~20 phút) theo đúng cấu trúc thời gian thi thật, không được tạm dừng giữa chừng.
- Tạo một `practice_session` khi bắt đầu, đánh dấu hoàn thành khi nộp xong, dùng để nhóm các attempt lại với nhau.

### Lịch sử (`/history`)
- Xem lại toàn bộ bài Writing đã lưu (nội dung text, thời gian làm, thời lượng dùng).
- Nghe lại toàn bộ bài Speaking đã ghi âm (audio player, thời lượng, thời điểm làm).

### Giao diện
- Chuyển light/dark theme (lưu lựa chọn ở `localStorage`, áp dụng ngay khi tải trang để tránh nháy giao diện).
- Thiết kế ink/violet riêng, có animation xuất hiện (`animate-fade-up`, `stagger`), waveform animation khi đang ghi âm.
- Responsive, tối ưu cho cả mobile lẫn desktop.

## Mô hình dữ liệu (Supabase/Postgres)

| Bảng | Mục đích |
|---|---|
| `writing_questions`, `speaking_questions` | Ngân hàng câu hỏi (đọc công khai cho user đã đăng nhập) |
| `writing_attempts`, `speaking_attempts` | Bài làm của từng user (RLS theo `user_id`); có thêm `score`/`max_score`/`feedback`/`graded_at` do AI chấm, `speaking_attempts` có thêm `transcript` |
| `practice_sessions` | Nhóm các attempt theo một lượt Full Test |
| `pronunciation_lists`, `pronunciation_items` | Danh sách từ luyện phát âm của từng user |
| `sentence_analyses` | Câu đã phân tích bằng AI (IPA, từ loại từng từ, cấu trúc ngữ pháp) của từng user |
| Storage bucket `speaking-recordings` | File ghi âm Speaking, path dạng `<user_id>/<question_id>/<timestamp>.webm` |
| Storage bucket `question-images` (riêng tư) | Ảnh đề bài Writing Part 1, truy cập qua signed URL |

Toàn bộ bảng đều bật RLS; schema định nghĩa trong `supabase/schema.sql` + các migration ở `supabase/migrations/`, dữ liệu mẫu nạp qua `supabase/seed.sql`.

## 1. Tạo Supabase project (miễn phí)

1. Vào https://supabase.com → tạo project mới.
2. Vào **SQL Editor**, chạy toàn bộ nội dung file `supabase/schema.sql` (tạo bảng + Row Level Security + storage bucket `speaking-recordings`).
3. Chạy tiếp `supabase/seed.sql` để tạo sẵn câu hỏi mẫu (có thể sửa/thêm trực tiếp trong **Table editor** sau này, không cần sửa code).
4. Vào **Project Settings → API**, lấy `Project URL` và `anon public` key.
5. Vào **Authentication → Providers → Email**: nếu muốn đăng ký xong đăng nhập ngay (không cần xác nhận email), tắt "Confirm email".

## 2. Lấy Claude API key (để chấm điểm AI)

1. Vào https://console.anthropic.com/settings/keys → tạo API key mới.
2. Tính năng chấm điểm là tuỳ chọn: nếu không cấu hình key, bài Writing/Speaking vẫn lưu bình thường, chỉ không có điểm/nhận xét AI.
3. Chi phí rất thấp cho dùng cá nhân — ước tính dưới 1 USD/tháng kể cả luyện mỗi ngày (model `claude-sonnet-5`, ~1-2k token mỗi lần chấm).

## 3. Cấu hình local

```bash
cp .env.local.example .env.local
```

Điền `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` và `ANTHROPIC_API_KEY` vào `.env.local`.

```bash
npm install
npm run dev
```

Mở http://localhost:3000, đăng ký tài khoản, bắt đầu luyện tập.

## 4. Deploy lên Vercel

1. Push repo lên GitHub.
2. Vào https://vercel.com/new, import repo.
3. Thêm 3 biến môi trường `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` trong phần Environment Variables.
4. Deploy. Dùng được từ mọi thiết bị, dữ liệu đồng bộ qua Supabase.

## Ghi chú

Câu hỏi Part 1 Writing và Part 2 Speaking (mô tả tranh) hiện dùng mô tả bằng chữ thay cho ảnh thật (vì chưa có ảnh). Có thể thêm ảnh thật bằng cách tải ảnh lên một bucket Storage công khai trong Supabase rồi cập nhật cột `image_url` của câu hỏi trong Table editor.

Chấm điểm AI (Writing + Speaking) dùng Claude, chạy qua server action ngay sau khi nộp bài — xem mục "Chấm điểm AI" ở từng phần Writing/Speaking phía trên. Phần Phát âm dùng chấm điểm riêng, miễn phí, chạy hoàn toàn trên trình duyệt (Web Speech API), không gọi Claude.
