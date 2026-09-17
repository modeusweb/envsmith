"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bars3Icon, LockClosedIcon, MoonIcon, SunIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme";
import { usePresence } from "@/hooks/use-presence";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

/** Matches the `popup-menu-out` animation length in `src/app/globals.css`. */
const MENU_EXIT_MS = 140;

/** Keeps the overlay in sync with the `h-14` header bar and the `md:` breakpoint from the markup. */
const HEADER_HEIGHT_CLASS = "top-14";
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

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
  const { mounted: menuMounted, state: menuState } = usePresence(menuOpen, MENU_EXIT_MS);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Freeze the page scroll while the menu covers it. The lock touches <html> only (see
  // `use-body-scroll-lock`), which keeps the sticky header exactly where it is.
  useBodyScrollLock(menuMounted);

  // Belt and braces for touch devices: also swallow gestures aimed at the page behind the menu.
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const swallowGesture = (event: Event) => event.preventDefault();
    const options = { passive: false };
    backdrop.addEventListener("wheel", swallowGesture, options);
    backdrop.addEventListener("touchmove", swallowGesture, options);

    return () => {
      backdrop.removeEventListener("wheel", swallowGesture);
      backdrop.removeEventListener("touchmove", swallowGesture);
    };
  }, [menuMounted]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // The menu is mobile-only: close it when the viewport grows into the desktop layout.
    const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  const brand = (
    <>
      <Image src="/logo.svg" alt="EnvSmith logo" width={28} height={28} className="rounded-md" priority />
      <span className="font-semibold tracking-tight truncate">EnvSmith</span>
    </>
  );

  return (
    <>
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
      </header>

      {/*
        Mobile menu.
        Rendered next to the header (not inside it): `backdrop-blur` on the header makes it a
        containing block for `position: fixed` children, which would break the viewport-sized
        backdrop. The overlay is out of flow, so opening the menu never moves the page content.
      */}
      {menuMounted && (
        <div className={`fixed inset-x-0 ${HEADER_HEIGHT_CLASS} bottom-0 z-30 md:hidden`}>
          <div
            ref={backdropRef}
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 touch-none bg-black/50 dark:bg-black/70 ${
              menuState === "open" ? "animate-popup-fade-in" : "animate-popup-fade-out"
            }`}
          />
          <nav
            id="mobile-nav"
            aria-label="Site"
            className={`absolute inset-x-0 top-0 origin-top border-b border-zinc-200 bg-white px-4 pt-2 pb-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 ${
              menuState === "open" ? "animate-popup-menu-in" : "animate-popup-menu-out"
            }`}
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
              <li className="mt-1 flex items-center gap-1.5 px-2 pb-1 text-xs text-zinc-500 sm:hidden dark:text-zinc-400">
                <LockClosedIcon className="size-3.5 shrink-0" aria-hidden />
                Your files never leave this browser.
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
