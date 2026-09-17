"use client";

import Link from "next/link";
import { ArrowRightIcon, ClipboardDocumentIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { DropZone } from "@/components/upload/DropZone";
import { PrivacySection } from "./PrivacySection";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { SiteFooter } from "@/components/ui/SiteFooter";

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
          <ShieldCheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          Privacy-first developer tool
        </span>
        <h1 className="mt-6 text-balance">
          <span className="block bg-gradient-to-br from-sky-700 via-sky-600 to-emerald-600 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-7xl dark:from-sky-400 dark:via-cyan-300 dark:to-emerald-400">
            EnvSmith
          </span>{" "}
          <span
            aria-hidden
            className="mx-auto mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 sm:w-28 dark:from-sky-400 dark:to-emerald-400"
          />{" "}
          <span className="mt-4 block text-lg font-medium tracking-tight text-zinc-600 sm:text-2xl dark:text-zinc-300">
            Safe <code className="font-mono text-[0.92em]">.env</code> Example Generator &amp; Validator
          </span>
        </h1>
        <p className="mt-3 text-xl sm:text-2xl font-medium tracking-tight text-balance">
          Keep your .env and .env.example in sync.
        </p>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-balance">
          Generate safe environment templates and runtime validation schemas — entirely in your browser.
        </p>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto text-balance">
          EnvSmith is a safe <code className="font-mono text-[0.92em]">.env</code> example generator and
          validator for Node.js, Next.js, Vite and Express projects. It reads a working environment file,
          documents every variable, and returns a clean template together with a validation schema — without
          sending a single value anywhere.
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

      <section
        aria-labelledby="seo-heading"
        className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8"
      >
        <h2 id="seo-heading" className="text-lg font-semibold tracking-tight">
          What EnvSmith does with your environment variables
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Parses real dotenv files</h3>
            <p className="mt-1.5">
              EnvSmith reads standard dotenv syntax: quoted and unquoted values,{" "}
              <code className="font-mono text-xs">export</code> prefixes, full-line and inline comments,
              values containing equals signs, and multiline content. Malformed lines are reported with a line
              number and a plain-language explanation instead of a cryptic parser error.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Detects types and secrets
            </h3>
            <p className="mt-1.5">
              Every variable gets an inferred type — string, number, boolean, URL or JSON — with a confidence
              level, plus a secret classification built from the key name, the value shape and known token
              patterns like JWTs and cloud API keys. Secrets are masked in the interface and never written to
              generated files.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Generates team-ready output
            </h3>
            <p className="mt-1.5">
              Produce a documented <code className="font-mono text-xs">.env.example</code> in three template
              modes, a runtime Zod schema with safe <code className="font-mono text-xs">process.env</code>{" "}
              coercion, TypeScript types, JSON Schema, and Markdown documentation. Copy everything to the
              clipboard or download the files and commit them to your repository.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          The workflow is simple: drop a <code className="font-mono text-xs">.env</code> file, review the
          detected variables, fix types and descriptions in the side editor, and compare the result against an
          existing <code className="font-mono text-xs">.env.example</code> to see which variables are missing,
          outdated or out of sync. Everything happens locally on your machine — there is no account, no
          upload, and no tracking involved at any step, so you can safely inspect production-like
          configuration files without exposing credentials.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Compare .env and .env.example
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
          <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
            ·
          </span>
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Read the full guide
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="workflow-heading"
        className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8"
      >
        <h2 id="workflow-heading" className="text-lg font-semibold tracking-tight">
          How to keep .env and .env.example in sync
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Syncing the two files is a five-step loop that takes about a minute. Every step runs locally in your
          browser, so you can work with a real environment file from a production-like setup without exposing
          credentials to a server or a third party.
        </p>
        <ol className="mt-6 space-y-5">
          <li className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Load your local .env file
            </h3>
            <p className="mt-1.5">
              Drag the file onto the drop zone above, choose it with the file picker, or paste the text
              directly. The parser handles quoted and unquoted values, export prefixes, full-line and inline
              comments, values that contain equals signs, and multiline entries. Everything stays in memory
              and disappears the moment you close the tab.
            </p>
          </li>
          <li className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Review every detected variable
            </h3>
            <p className="mt-1.5">
              The table lists each key with its inferred type, secret classification, required flag, masked
              value and detected issues. Sort by any column, filter the list by type or severity, and search
              by name to reach the entries that need attention first.
            </p>
          </li>
          <li className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Correct types, secrets and descriptions
            </h3>
            <p className="mt-1.5">
              Open any row to edit its metadata in the side panel. Add a description that documents the
              variable for new teammates, mark it as required or optional, set a fallback value, and adjust
              the secret classification whenever the automatic guess does not match your intent.
            </p>
          </li>
          <li className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Compare against the committed .env.example
            </h3>
            <p className="mt-1.5">
              Upload the template that already lives in your repository and EnvSmith reports what drifted:
              variables missing from the example, keys that exist only in the example, stale entries, type
              mismatches, duplicates, invalid names and possible secret leaks.
            </p>
          </li>
          <li className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Generate and commit the output
            </h3>
            <p className="mt-1.5">
              Pick a template mode, then copy or download the .env.example, the validation schema and optional
              Markdown documentation. Commit those files to the repository and every developer on the team
              starts from the same documented contract instead of guessing which key is still required.
            </p>
          </li>
        </ol>
      </section>

      <section
        aria-labelledby="validation-heading"
        className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8"
      >
        <h2 id="validation-heading" className="text-lg font-semibold tracking-tight">
          Why environment variables need runtime validation
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Values inside <code className="font-mono text-xs">process.env</code> are always strings, so a
          missing or mistyped variable usually fails somewhere deep in the application instead of at startup.
          A generated schema moves that failure to the first line of code that runs: the process stops with a
          readable message that names the variable and the shape it expected.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          EnvSmith writes schemas that respect this behaviour. Numbers are coerced rather than blindly cast,
          booleans accept the string forms dotenv really produces, URLs are validated as URLs, and secrets are
          required to be non-empty. Optional variables stay optional, and default values appear only where you
          asked for them, so the schema never invents configuration on your behalf.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          The same rules can be exported as Zod, as plain TypeScript types, as JSON Schema or as a small
          dotenv-style check, so the generated validation fits the conventions your project already follows.
        </p>
      </section>

      <section
        aria-labelledby="modes-heading"
        className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8"
      >
        <h2 id="modes-heading" className="text-lg font-semibold tracking-tight">
          Three template modes with one safe default
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Smart mode is the default: secrets are always cleared, while obviously harmless values such as
          ports, timeouts and feature flags are kept so the template stays useful. Safe mode clears every
          secret and keeps the remaining values, and Template mode clears all values so nobody mistakes a
          local setting for a shared default. In all three modes a secret is never written to the generated
          file, not even as a placeholder comment.
        </p>
      </section>

      <ShareButtons />

      <SiteFooter />
    </main>
  );
}
