"use client";

import Link from "next/link";
import { ArrowRightIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { DropZone } from "@/components/upload/DropZone";
import { PrivacySection } from "./PrivacySection";

const heroExample = [
  { label: ".env", lines: ["DATABASE_URL=••••••••", "API_KEY=••••••••", "PORT=3000"] },
  { label: ".env.example", lines: ["DATABASE_URL=", "API_KEY=", "PORT=3000"] },
  {
    label: "Zod",
    lines: ["DATABASE_URL: z.string().url()", "API_KEY: z.string().min(1)", "PORT: z.coerce.number()"],
  },
];

export function Landing({
  onFile,
  onPasteClick,
}: {
  onFile: (fileName: string, fileSize: number, content: string) => void;
  onPasteClick: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 flex-1 w-full">
      <section className="text-center pt-14 sm:pt-20 pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          EnvSmith · Privacy-first developer tool
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight">EnvSmith</h1>
        <p className="mt-3 text-xl sm:text-2xl font-medium tracking-tight text-balance">
          Keep your .env and .env.example in sync.
        </p>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-balance">
          Generate safe environment templates and runtime validation schemas — entirely in your browser.
        </p>
      </section>

      <section className="w-full" aria-label="Upload your .env file">
        <DropZone onFile={onFile} />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Compare .env files
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
          <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
            ·
          </span>
          <button
            type="button"
            onClick={onPasteClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            <ClipboardDocumentIcon className="size-4" aria-hidden />
            Paste .env text instead
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Your environment variables never leave your browser.
        </p>
      </section>

      <section aria-label="Example of what you get" className="mt-14">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch">
          {heroExample.map((card, i) => (
            <div key={card.label} className="contents">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 font-mono">
                  {card.label}
                </div>
                <pre className="p-3 font-mono text-xs leading-6 overflow-x-auto">
                  {card.lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </pre>
              </div>
              {i < heroExample.length - 1 && (
                <div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600" aria-hidden>
                  <ArrowRightIcon className="size-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PrivacySection />

      <footer className="py-10 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="flex flex-col items-center gap-3">
          <span>EnvSmith — no accounts, no uploads, no tracking.</span>
          <nav aria-label="Footer" className="flex items-center gap-4">
            <Link href="/about" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
              About
            </Link>
            <Link href="/help" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
              Help
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
