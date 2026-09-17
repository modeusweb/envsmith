import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

const GITHUB_URL = "https://github.com/modeusweb/envsmith";

/** Site-wide footer with navigation. */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-500">
        <span>EnvSmith — no accounts, no uploads, no tracking.</span>
        <div className="flex items-center gap-4">
          <nav aria-label="Footer" className="flex items-center gap-4">
            <Link
              href="/"
              className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
            >
              About the project
            </Link>
            <Link
              href="/help"
              className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
            >
              Help and FAQ
            </Link>
            <Link
              href="/compare"
              className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
            >
              Compare two .env files
            </Link>
          </nav>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EnvSmith on GitHub (opens in a new tab)"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
            <ArrowTopRightOnSquareIcon className="size-3 text-zinc-400" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
