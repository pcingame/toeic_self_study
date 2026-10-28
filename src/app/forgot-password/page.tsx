import Link from "next/link";
import { requestPasswordReset } from "../login/actions";
import WaveformBars from "@/components/WaveformBars";
import SubmitButton from "@/components/auth/SubmitButton";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; email?: string }>;
}) {
  const { error, message, email } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="animate-fade-up w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center text-[var(--color-primary)]">
            <WaveformBars />
          </div>
          <h1 className="h1-page">Quên mật khẩu</h1>
          <p className="mt-1 text-sm text-muted">Nhập email để nhận liên kết đặt lại mật khẩu</p>
        </div>

        {message && (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-3 py-2 text-sm text-[var(--color-primary)]">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={requestPasswordReset} className="card space-y-4 p-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={email}
              required
              className="input-field mt-1"
            />
          </div>
          <SubmitButton pendingText="Đang gửi…">Gửi liên kết đặt lại</SubmitButton>
        </form>

        <p className="text-center text-sm text-muted">
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
