# TOEIC Self-Study — Writing & Speaking

Web tự ôn luyện TOEIC Writing (8 câu) & Speaking (11 câu), đúng format và thời gian thi thật, lưu bài làm trên server để xem lại từ bất kỳ thiết bị nào.

## 1. Tạo Supabase project (miễn phí)

1. Vào https://supabase.com → tạo project mới.
2. Vào **SQL Editor**, chạy toàn bộ nội dung file `supabase/schema.sql` (tạo bảng + Row Level Security + storage bucket `speaking-recordings`).
3. Chạy tiếp `supabase/seed.sql` để tạo sẵn câu hỏi mẫu (có thể sửa/thêm trực tiếp trong **Table editor** sau này, không cần sửa code).
4. Vào **Project Settings → API**, lấy `Project URL` và `anon public` key.
5. Vào **Authentication → Providers → Email**: nếu muốn đăng ký xong đăng nhập ngay (không cần xác nhận email), tắt "Confirm email".

## 2. Cấu hình local

```bash
cp .env.local.example .env.local
```

Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vừa lấy ở trên vào `.env.local`.

```bash
npm install
npm run dev
```

Mở http://localhost:3000, đăng ký tài khoản, bắt đầu luyện tập.

## 3. Deploy lên Vercel

1. Push repo lên GitHub.
2. Vào https://vercel.com/new, import repo.
3. Thêm 2 biến môi trường `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong phần Environment Variables.
4. Deploy. Dùng được từ mọi thiết bị, dữ liệu đồng bộ qua Supabase.

## Cấu trúc tính năng

- `/writing`, `/speaking` — luyện từng câu riêng lẻ, có đồng hồ đếm giờ theo cấu hình trong DB (`time_limit_sec` / `prep_time_sec` / `speak_time_sec`).
- `/full-test/writing`, `/full-test/speaking` — làm liên tục toàn bộ đề theo đúng cấu trúc thời gian thi thật (Part 1 Writing dùng chung 1 đồng hồ 8 phút cho 5 câu).
- `/history` — xem lại bài Writing (text) và bài Speaking (nghe lại ghi âm).
- `/` — tổng quan tiến độ (số câu đã luyện, hoạt động gần đây).

Câu hỏi Part 1 Writing và Part 2 Speaking (mô tả tranh) hiện dùng mô tả bằng chữ thay cho ảnh thật (vì chưa có ảnh). Có thể thêm ảnh thật bằng cách tải ảnh lên một bucket Storage công khai trong Supabase rồi cập nhật cột `image_url` của câu hỏi trong Table editor.

Chưa có chấm điểm AI — đây là nơi luyện tập đúng format/thời gian và lưu lại bài làm để tự xem lại.
