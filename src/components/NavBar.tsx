import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import NavLinks from "@/components/NavLinks";
import WaveformBars from "@/components/WaveformBars";

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
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-paper)]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <WaveformBars className="text-[var(--color-primary)]" />
            TOEIC Self-Study
          </Link>
          <NavLinks links={LINKS} />
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted transition-colors hover:text-[var(--color-accent)]">
            Đăng xuất
          </button>
        </form>
      </nav>
    </header>
  );
}
