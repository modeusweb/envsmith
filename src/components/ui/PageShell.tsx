import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/ui/Header";
import { SiteFooter } from "@/components/ui/SiteFooter";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Shared layout for static content pages (about, help). */
export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 flex-1 w-full py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            ← Back to home
          </Link>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">{subtitle}</p>}
        <div className="mt-8 space-y-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

