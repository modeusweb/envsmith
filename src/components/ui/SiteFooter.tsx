import Link from "next/link";

/** Site-wide footer with navigation. */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-500">
        <span>EnvSmith — no accounts, no uploads, no tracking.</span>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
            Home
          </Link>
          <Link href="/about" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
            About
          </Link>
          <Link href="/help" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
            Help
          </Link>
          <Link href="/compare" className="hover:text-zinc-800 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500 rounded">
            Compare
          </Link>
        </nav>
      </div>
    </footer>
  );
}
