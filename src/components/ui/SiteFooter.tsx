import Link from "next/link";
import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const GITHUB_URL = "https://github.com/modeusweb/envsmith";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About the project" },
  { href: "/help", label: "Help and FAQ" },
  { href: "/compare", label: "Compare two .env files" },
] as const;

const LINK_CLASS =
  "rounded text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-400 dark:hover:text-zinc-100";

/** Site-wide footer with navigation. */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-semibold tracking-tight">EnvSmith</span>
          </div>
          <p className="mt-2 max-w-sm text-xs text-zinc-500 dark:text-zinc-500">
            Keep your environment in sync — no accounts, no uploads, no tracking.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
            <LockClosedIcon className="size-3.5 shrink-0" aria-hidden />
            Everything is processed in your browser.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:flex sm:flex-col sm:gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EnvSmith on GitHub (opens in a new tab)"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
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
