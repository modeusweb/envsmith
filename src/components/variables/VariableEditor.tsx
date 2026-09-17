"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { EnvVariable } from "@/types/analysis";
import { TypeSelect } from "./VariablesTable";
import { generateExample } from "@/lib/env/example-generator";
import { zodRuleForVariable } from "@/lib/env/preview";

interface VariableEditorProps {
  variable: EnvVariable;
  onUpdate: (patch: Partial<EnvVariable>) => void;
  onClose: () => void;
}

export function VariableEditor({ variable, onUpdate, onClose }: VariableEditorProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isSecret = variable.classification === "secret" || variable.classification === "likely-secret";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Edit ${variable.key}`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-xl overflow-y-auto"
        role="document"
      >
        <div className="sticky top-0 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 z-10">
          <div className="min-w-0">
            <h2 className="font-mono text-sm font-semibold truncate">{variable.key}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Line {variable.originalLine}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label="Close editor"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="p-4 space-y-5 text-sm">
          <div>
            <label className="block font-medium mb-1.5" htmlFor="ve-type">
              Type
            </label>
            <div className="flex items-center gap-2">
              <TypeSelect value={variable.type} onChange={(t) => onUpdate({ type: t })} />
              {variable.confidence !== "high" && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {variable.confidence} confidence
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="block font-medium mb-1.5">Secret classification</span>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Secret classification">
              {(["secret", "likely-secret", "public", "unknown"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={variable.classification === c}
                  onClick={() => onUpdate({ classification: c })}
                  className={`rounded-md border px-2 py-1 text-xs font-medium capitalize focus-visible:outline-2 focus-visible:outline-sky-500 ${
                    variable.classification === c
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {c.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between">
            <span className="font-medium">Required</span>
            <input
              id="ve-required"
              type="checkbox"
              checked={variable.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="size-4 rounded border-zinc-300 focus-visible:outline-2 focus-visible:outline-sky-500"
            />
          </label>

          <div>
            <label className="block font-medium mb-1.5" htmlFor="ve-desc">
              Description
            </label>
            <textarea
              id="ve-desc"
              value={variable.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
              placeholder="e.g. PostgreSQL connection string"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-sky-500 resize-y"
            />
          </div>

          {!isSecret ? (
            <div>
              <label className="block font-medium mb-1.5" htmlFor="ve-value">
                Value (kept in template)
              </label>
              <input
                id="ve-value"
                type="text"
                value={variable.rawValue}
                onChange={(e) => onUpdate({ rawValue: e.target.value })}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 font-mono text-xs focus-visible:outline-2 focus-visible:outline-sky-500"
              />
            </div>
          ) : (
            <p className="rounded-md bg-red-50 dark:bg-red-950/40 border border-red-500/20 px-3 py-2 text-xs text-red-600 dark:text-red-400">
              Secret values are never included in generated files.
            </p>
          )}

          {variable.issues.length > 0 && (
            <div>
              <span className="block font-medium mb-1.5">Issues</span>
              <ul className="space-y-1.5">
                {variable.issues.map((issue, i) => (
                  <li key={i} className="rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2">
                    <p className="text-xs font-medium">{issue.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{issue.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <span className="block font-medium mb-1.5">Generated preview</span>
            <div className="space-y-2">
              <pre className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 font-mono text-xs overflow-x-auto">
                {generateExample([variable], { mode: "smart", includeDescriptions: true }).trimEnd()}
              </pre>
              <pre className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 font-mono text-xs overflow-x-auto">
                {zodRuleForVariable(variable)}
              </pre>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
