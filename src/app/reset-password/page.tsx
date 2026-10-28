import { resetPassword } from "../login/actions";
import WaveformBars from "@/components/WaveformBars";
import SubmitButton from "@/components/auth/SubmitButton";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="animate-fade-up w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center text-[var(--color-primary)]">
            <WaveformBars />
          </div>
          <h1 className="h1-page">Đặt mật khẩu mới</h1>
          <p className="mt-1 text-sm text-muted">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={resetPassword} className="card space-y-4 p-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu mới (ít nhất 6 ký tự)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Nhập lại mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="input-field mt-1"
            />
          </div>
          <SubmitButton pendingText="Đang lưu…">Đổi mật khẩu</SubmitButton>
        </form>
      </div>
    </div>
  );
}
