"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";

const GITHUB_URL = "https://github.com/modeusweb/envsmith";

/** Simple social sharing row (native share + link copy, no tracking scripts). */
export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.origin : "https://envsmith.vercel.app";
  const shareText = "EnvSmith — safe .env.example generator & Zod validator that runs entirely in your browser";
  const encoded = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);

  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedText}` },
    { label: "Share on Reddit", href: `https://www.reddit.com/submit?url=${encoded}&title=${encodedText}` },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { label: "Share on Hacker News", href: `https://news.ycombinator.com/submitlink?u=${encoded}&t=${encodedText}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — do nothing
    }
  };

  return (
    <section aria-label="Share EnvSmith" className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
      <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Find EnvSmith useful?</h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Share it with your team — links open in a new tab, nothing is tracked.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sky-500"
        >
          {copied ? <CheckIcon className="size-3.5 text-emerald-500" aria-hidden /> : <LinkIcon className="size-3.5" aria-hidden />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sky-500"
        >
          Star on GitHub
        </a>
        <span aria-hidden className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
          ·
        </span>
        <Link
          href="/help"
          className="inline-flex items-center text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
        >
          Read the guide
        </Link>
      </div>
    </section>
  );
}
