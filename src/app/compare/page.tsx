"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { ComparePanel } from "@/components/compare/ComparePanel";
import { DropZone } from "@/components/upload/DropZone";
import { useEnvWorkspace } from "@/hooks/use-env-workspace";

export default function ComparePage() {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const { state, diff, loadEnv, loadExample } = useEnvWorkspace();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 flex-1 w-full py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            ← Back to home
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Compare .env files</h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Drop your local <span className="font-mono text-sm">.env</span>, then add an existing{" "}
          <span className="font-mono text-sm">.env.example</span> to see what is missing, outdated, or out of sync —
          without sending anything anywhere.
        </p>

        <section aria-label="Step 1: upload your .env" className="mt-8">
          <h2 className="text-sm font-medium mb-3">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold mr-1.5">
              1
            </span>
            Upload your local .env
            {state.loaded && (
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {state.fileName} · {state.variables.length} variables
              </span>
            )}
          </h2>
          <DropZone onFile={loadEnv} />
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setPasteOpen(true)}
              className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
            >
              Paste .env text instead
            </button>
          </div>
        </section>

        <section aria-label="Step 2: upload your .env.example" className="mt-10">
          <h2 className="text-sm font-medium mb-3">
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold mr-1.5 ${
                state.loaded ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-400"
              }`}
            >
              2
            </span>
            Add an existing .env.example
          </h2>
          {state.loaded ? (
            <ComparePanel diff={diff} exampleFileName={state.exampleFileName} onExampleFile={loadExample} />
          ) : (
            <p className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Upload your .env first.
            </p>
          )}
        </section>

        {state.loaded && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500"
            >
              Continue in the full workspace
            </Link>
          </div>
        )}
      </main>
      {pasteOpen && (
        <PasteDialog
          value={pasteText}
          onChange={setPasteText}
          onSubmit={() => {
            if (pasteText.trim()) {
              loadEnv("pasted.env", new Blob([pasteText]).size, pasteText);
              setPasteOpen(false);
            }
          }}
          onClose={() => setPasteOpen(false)}
        />
      )}
    </>
  );
}


function PasteDialog({
  value,
  onChange,
  onSubmit,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Paste your .env content">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xl">
        <h2 className="text-sm font-semibold">Paste your .env content</h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Pasted content is processed locally in your browser and never uploaded.
        </p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          spellCheck={false}
          aria-label=".env content"
          className="mt-3 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2.5 font-mono text-xs focus-visible:outline-2 focus-visible:outline-sky-500"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim()}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-sm font-medium text-white dark:text-zinc-900 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
}
