"use client";

import { diffStatusLabel, diffStatusSeverity } from "@/lib/env/diff";
import { DropZone } from "@/components/upload/DropZone";
import type { EnvDiff } from "@/types/analysis";

const DOT: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-zinc-400",
};

interface ComparePanelProps {
  diff: EnvDiff | null;
  exampleFileName: string | null;
  onExampleFile: (fileName: string, content: string) => void;
}

export function ComparePanel({ diff, exampleFileName, onExampleFile }: ComparePanelProps) {
  return (
    <section aria-labelledby="compare-heading" className="space-y-4">
      <h2 id="compare-heading" className="font-semibold tracking-tight">
        Compare .env with .env.example
      </h2>

      {!exampleFileName && (
        <div className="max-w-xl">
          <DropZone
            compact
            label="Drop your .env.example to compare"
            onFile={(name, _size, content) => onExampleFile(name, content)}
          />
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Everything stays in your browser.</p>
        </div>
      )}

      {exampleFileName && !diff && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No variables found in {exampleFileName}.</p>
      )}

      {diff && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <Stat label="In sync" value={diff.summary.synced} cls="text-emerald-600 dark:text-emerald-400" />
            <Stat label="Attention" value={diff.summary.attention} cls="text-amber-600 dark:text-amber-400" />
            <Stat label="Issues" value={diff.summary.issues} cls="text-red-600 dark:text-red-400" />
          </div>
          <ul className="rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
            {diff.items.map((item) => {
              const sev = diffStatusSeverity(item.status);
              return (
                <li
                  key={`${item.key}-${item.status}`}
                  className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-zinc-900/50"
                >
                  <span aria-hidden className={`size-2 rounded-full shrink-0 ${DOT[sev]}`} />
                  <span className="font-mono text-xs font-medium">{item.key}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {diffStatusLabel(item.status)}
                  </span>
                  <span
                    className={`ml-auto text-[11px] font-medium ${
                      sev === "green"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : sev === "yellow"
                          ? "text-amber-600 dark:text-amber-400"
                          : sev === "red"
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-400"
                    }`}
                  >
                    {sev === "green"
                      ? "synced"
                      : sev === "gray"
                        ? "info"
                        : sev === "red"
                          ? "issue"
                          : "attention"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`text-lg font-semibold ${cls}`}>{value}</span>
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    </span>
  );
}
