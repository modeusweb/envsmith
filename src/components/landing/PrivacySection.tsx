"use client";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export function PrivacySection() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="mt-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5">
        <ShieldCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <h2 id="privacy-heading" className="font-semibold tracking-tight">
          Private by design
        </h2>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
        EnvSmith processes your .env locally in your browser. We don&apos;t upload, store, or inspect your
        environment variables. There is no backend, no database, and no telemetry involved in parsing.
      </p>
      <ol className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 text-sm">
        {[
          { title: "Browser", desc: "You drop a file" },
          { title: "Local processing", desc: "Parsing in memory only" },
          { title: "Output", desc: ".env.example + validation" },
        ].map((step, i) => (
          <li
            key={step.title}
            className="flex-1 flex sm:flex-col items-center sm:items-start gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
              {i + 1}
            </span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-zinc-500 dark:text-zinc-400">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
