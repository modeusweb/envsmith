"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, LockClosedIcon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme";

const NAV_LINKS = [
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
] as const;

const LINK_CLASS =
  "rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-sky-500";

export function Header({ onHome }: { onHome?: () => void }) {
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const brand = (
    <>
      <Image src="/logo.svg" alt="EnvSmith logo" width={28} height={28} className="rounded-md" priority />
      <span className="font-semibold tracking-tight truncate">EnvSmith</span>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {onHome ? (
          <button
            type="button"
            onClick={onHome}
            className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label="EnvSmith — back to home"
          >
            {brand}
          </button>
        ) : (
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label="EnvSmith — back to home"
          >
            {brand}
          </Link>
        )}

        <nav
          aria-label="Site"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 text-sm md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex dark:bg-emerald-950/50 dark:text-emerald-400">
            <LockClosedIcon className="size-3.5" aria-hidden />
            100% local processing
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-sky-500 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Site"
          className="border-t border-zinc-200 bg-white px-4 py-2 md:hidden dark:border-zinc-800 dark:bg-zinc-950"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-1 flex items-center gap-1.5 px-2 pb-2 text-xs text-zinc-500 sm:hidden dark:text-zinc-400">
              <LockClosedIcon className="size-3.5 shrink-0" aria-hidden />
              Your files never leave this browser.
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
