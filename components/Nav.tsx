"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "Trends" },
  { href: "/admin", label: "Alert settings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-campus-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4 flex flex-col gap-3">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-wide text-campus-100">
            University of Abuja
          </p>
          <h1 className="text-base sm:text-lg font-semibold leading-snug">
            Smart Weather Monitoring &amp; Environmental Alert System
          </h1>
        </div>
        <nav className="flex gap-1 overflow-x-auto -mx-1 px-1 no-scrollbar">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap shrink-0 ${
                pathname === link.href
                  ? "bg-white text-campus-700"
                  : "text-campus-100 hover:bg-campus-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
