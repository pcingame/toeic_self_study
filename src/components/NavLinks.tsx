"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-5 text-sm">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`ink-underline shrink-0 pb-0.5 whitespace-nowrap transition-colors ${
              active ? "bg-[length:100%_2px] font-medium text-[var(--color-primary)]" : "text-muted"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
