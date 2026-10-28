import Link from "next/link";
import { login } from "./actions";
import WaveformBars from "@/components/WaveformBars";
import SubmitButton from "@/components/auth/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string; email?: string }>;
}) {
  const { error, message, next, email } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="animate-fade-up w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center text-[var(--color-primary)]">
            <WaveformBars />
          </div>
          <h1 className="h1-page">Đăng nhập</h1>
          <p className="mt-1 text-sm text-muted">Vào luyện TOEIC Writing &amp; Speaking của bạn</p>
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

        <form action={login} className="card space-y-4 p-6">
          <input type="hidden" name="next" value={next ?? "/"} />
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
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Mật khẩu
              </label>
              <Link href="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field mt-1"
            />
          </div>
          <SubmitButton pendingText="Đang đăng nhập…">Đăng nhập</SubmitButton>
        </form>

        <p className="text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-[var(--color-primary)] hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
