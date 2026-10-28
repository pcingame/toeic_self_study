import Link from "next/link";
import { signup } from "../login/actions";
import WaveformBars from "@/components/WaveformBars";
import SubmitButton from "@/components/auth/SubmitButton";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const { error, email } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="animate-fade-up w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center text-[var(--color-primary)]">
            <WaveformBars />
          </div>
          <h1 className="h1-page">Đăng ký</h1>
          <p className="mt-1 text-sm text-muted">Tạo tài khoản để lưu bài luyện tập của bạn</p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={signup} className="card space-y-4 p-6">
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
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu (ít nhất 6 ký tự)
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
              Nhập lại mật khẩu
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
          <SubmitButton pendingText="Đang tạo tài khoản…">Tạo tài khoản</SubmitButton>
        </form>

        <p className="text-center text-sm text-muted">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
