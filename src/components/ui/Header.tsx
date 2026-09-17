"use client";

import Image from "next/image";
import { LockClosedIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme";

export function Header() {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image src="/logo.svg" alt="EnvSmith logo" width={28} height={28} className="rounded-md" priority />
          <span className="font-semibold tracking-tight truncate">EnvSmith</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <LockClosedIcon className="size-3.5" aria-hidden />
            100% local processing
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
