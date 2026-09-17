"use client";

import { useEffect, useState } from "react";
import {
  SparklesIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { VariablesTable } from "@/components/variables/VariablesTable";
import { VariableEditor } from "@/components/variables/VariableEditor";
import { IssuesPanel } from "./IssuesPanel";
import { GenerationCenter } from "@/components/generator/GenerationCenter";
import { ComparePanel } from "@/components/compare/ComparePanel";
import { DropZone } from "@/components/upload/DropZone";
import type { EnvVariable, EnvFileStats, EnvDiff } from "@/types/analysis";
import type { EnvParseError } from "@/types/env";

type Tab = "variables" | "compare" | "issues";

interface WorkspaceProps {
  stats: EnvFileStats;
  variables: EnvVariable[];
  parseErrors: EnvParseError[];
  mode: "smart" | "safe" | "template";
  onModeChange: (m: "smart" | "safe" | "template") => void;
  exampleFileName: string | null;
  diff: EnvDiff | null;
  onExampleFile: (fileName: string, content: string) => void;
  onRemoveVariable: (key: string) => void;
  onUpdateVariable: (key: string, patch: Partial<EnvVariable>) => void;
  onReset: () => void;
}

export function Workspace({
  stats,
  variables,
  parseErrors,
  mode,
  onModeChange,
  exampleFileName,
  diff,
  onExampleFile,
  onRemoveVariable,
  onUpdateVariable,
  onReset,
}: WorkspaceProps) {
  const [tab, setTab] = useState<Tab>("variables");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Cmd/Ctrl+K focuses the variables search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setTab("variables");
        requestAnimationFrame(() => {
          const input = document.querySelector<HTMLInputElement>(
            'input[type="search"][aria-label="Search variables"]'
          );
          input?.focus();
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selected = selectedKey ? (variables.find((v) => v.key === selectedKey) ?? null) : null;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "variables", label: "Variables", badge: variables.length },
    { key: "compare", label: "Compare", badge: exampleFileName ? diff?.items.length : undefined },
    { key: "issues", label: "Issues", badge: stats.warnings },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 flex-1 w-full py-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-3 text-sm">
        <Stat label="Variables" value={stats.variables} />
        <Stat label="Secrets" value={stats.secrets} />
        <Stat label="Warnings" value={stats.warnings} />
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          Ready
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
          aria-live="polite"
        >
          <LockClosedIcon className="size-3.5" aria-hidden />
          Your .env never leaves your browser.
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
          >
            New file
          </button>
          <button
            type="button"
            onClick={() => setGenerating(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            <SparklesIcon className="size-4" aria-hidden />
            Generate
          </button>
        </div>
      </div>

      <div
        className="mt-4 flex gap-1 border-b border-zinc-200 dark:border-zinc-800"
        role="tablist"
        aria-label="Workspace sections"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ${
              tab === t.key
                ? "border-sky-500 text-sky-600 dark:text-sky-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t.key === "compare" && <ArrowsRightLeftIcon className="size-4" aria-hidden />}
            {t.key === "issues" && <ExclamationTriangleIcon className="size-4" aria-hidden />}
            {t.label}
            {t.badge !== undefined && (
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "variables" && (
          <>
            {parseErrors.length > 0 && (
              <div className="mb-4">
                <IssuesPanel parseErrors={parseErrors} variables={[]} />
              </div>
            )}
            <VariablesTable
              variables={variables}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              onRemove={onRemoveVariable}
            />
          </>
        )}

        {tab === "compare" && (
          <ComparePanel diff={diff} exampleFileName={exampleFileName} onExampleFile={onExampleFile} />
        )}

        {tab === "issues" && <IssuesPanel parseErrors={parseErrors} variables={variables} />}
      </div>

      {selected && (
        <VariableEditor
          variable={selected}
          onUpdate={(patch) => onUpdateVariable(selected.key, patch)}
          onClose={() => setSelectedKey(null)}
        />
      )}

      {generating && (
        <GenerationCenter
          variables={variables}
          mode={mode}
          onModeChange={onModeChange}
          onClose={() => setGenerating(false)}
        />
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-semibold">{value}</span>
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    </span>
  );
}

export function CompareOnlyView({
  onFile,
  onBack,
}: {
  onFile: (fileName: string, fileSize: number, content: string) => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 flex-1 w-full py-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Back to home
      </button>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Compare .env files</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Start by dropping your local <span className="font-mono">.env</span>. Then add an existing{" "}
        <span className="font-mono">.env.example</span> to see what is missing or outdated.
      </p>
      <div className="mt-6 max-w-2xl">
        <DropZone onFile={onFile} />
      </div>
    </main>
  );
}
