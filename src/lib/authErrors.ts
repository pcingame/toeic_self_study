// Maps Supabase Auth (GoTrue) error messages to friendlier Vietnamese text.
// Falls back to the original message (prefixed) for anything not recognized.

const KNOWN_MESSAGES: { test: (msg: string) => boolean; vi: string }[] = [
  { test: (m) => m.includes("Invalid login credentials"), vi: "Email hoặc mật khẩu không đúng." },
  {
    test: (m) => m.includes("Email not confirmed"),
    vi: "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư để xác nhận tài khoản trước khi đăng nhập.",
  },
  {
    test: (m) => m.includes("User already registered"),
    vi: "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.",
  },
  { test: (m) => m.includes("Password should be at least"), vi: "Mật khẩu phải có ít nhất 6 ký tự." },
  {
    test: (m) => m.includes("New password should be different"),
    vi: "Mật khẩu mới phải khác mật khẩu cũ.",
  },
  { test: (m) => m.includes("Unable to validate email address"), vi: "Địa chỉ email không hợp lệ." },
  { test: (m) => m.includes("rate limit"), vi: "Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút." },
  {
    test: (m) => m.includes("security purposes"),
    vi: "Vui lòng đợi một chút trước khi thử lại.",
  },
];

export function mapAuthError(message: string): string {
  const match = KNOWN_MESSAGES.find((m) => m.test(message));
  if (match) return match.vi;
  return `Đã có lỗi xảy ra: ${message}`;
}
