import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

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
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold">TOEIC Self-Study</span>
          <div className="flex gap-4 text-sm text-gray-600">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-600">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-red-600">
            Đăng xuất
          </button>
        </form>
      </nav>
    </header>
  );
}
