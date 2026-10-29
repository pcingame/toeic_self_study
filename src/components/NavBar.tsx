import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import NavLinks from "@/components/NavLinks";
import WaveformBars from "@/components/WaveformBars";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Tổng quan" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/pronunciation", label: "Phát âm" },
  { href: "/full-test", label: "Full Test" },
  { href: "/history", label: "Lịch sử" },
];

export default async function NavBar() {
  const supabase = await createClient();
  // getSession() reads the already-validated session from cookies with no
  // network round trip -- safe here because middleware already called the
  // network-validating getUser() for this request before any page renders.
  const { data } = await supabase.auth.getSession();

  if (!data.session) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-paper)]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-6 overflow-x-auto">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold">
            <WaveformBars className="text-[var(--color-primary)]" />
            <span className="hidden sm:inline">TOEIC Self-Study</span>
          </Link>
          <NavLinks links={LINKS} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="text-sm text-muted transition-colors hover:text-[var(--color-accent)]">
              Đăng xuất
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
