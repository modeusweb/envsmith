"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Landing } from "@/components/landing/Landing";
import { Workspace, CompareOnlyView } from "@/components/workspace/Workspace";
import { useEnvWorkspace } from "@/hooks/use-env-workspace";

type View = "landing" | "workspace" | "compare-only";

export default function HomePage() {
  const [view, setView] = useState<View>("landing");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const { state, stats, diff, loadEnv, loadExample, updateVariable, removeVariable, setMode, reset } =
    useEnvWorkspace();

  const handleFile = (fileName: string, fileSize: number, content: string) => {
    loadEnv(fileName, fileSize, content);
    setView("workspace");
    setPasteOpen(false);
  };

  if (view === "landing") {
    return (
      <>
        <Header />
        <Landing
          onFile={handleFile}
          onCompareClick={() => setView("compare-only")}
          onPasteClick={() => setPasteOpen(true)}
        />
        {pasteOpen && (
          <PasteDialog
            value={pasteText}
            onChange={setPasteText}
            onSubmit={() => {
              if (pasteText.trim()) {
                handleFile("pasted.env", new Blob([pasteText]).size, pasteText);
              }
            }}
            onClose={() => setPasteOpen(false)}
          />
        )}
      </>
    );
  }

  if (view === "compare-only") {
    return (
      <>
        <Header />
        <CompareOnlyView onFile={handleFile} onBack={() => setView("landing")} />
      </>
    );
  }

  return (
    <>
      <Header />
      <Workspace
        stats={stats}
        variables={state.variables}
        parseErrors={state.parseErrors}
        mode={state.mode}
        onModeChange={setMode}
        exampleFileName={state.exampleFileName}
        diff={diff}
        onExampleFile={loadExample}
        onRemoveVariable={removeVariable}
        onUpdateVariable={updateVariable}
        onReset={() => {
          reset();
          setView("landing");
        }}
      />
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
      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xl">
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
