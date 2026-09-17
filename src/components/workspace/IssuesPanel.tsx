"use client";

import type { EnvParseError } from "@/types/env";
import type { EnvVariable } from "@/types/analysis";
import { severityIcon } from "@/components/variables/VariablesTable";

interface IssuesPanelProps {
  parseErrors: EnvParseError[];
  variables: EnvVariable[];
}

export function IssuesPanel({ parseErrors, variables }: IssuesPanelProps) {
  const varIssues = variables.flatMap((v) =>
    v.issues.filter((i) => i.severity !== "info").map((issue) => ({ ...issue, key: v.key }))
  );

  if (parseErrors.length === 0 && varIssues.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-700 dark:text-emerald-400">
        Everything looks good.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {parseErrors.map((err, i) => (
        <div key={`p${i}`} className="rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/30 p-3">
          <div className="flex items-start gap-2">
            {severityIcon("error")}
            <div className="min-w-0">
              <p className="text-sm font-medium">Could not parse line {err.line}.</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{err.message}</p>
              <pre className="mt-1.5 font-mono text-xs overflow-x-auto text-red-700 dark:text-red-400">
                {err.snippet}
              </pre>
            </div>
          </div>
        </div>
      ))}
      {varIssues.map((issue, i) => (
        <div
          key={`v${i}`}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3"
        >
          <div className="flex items-start gap-2">
            {severityIcon(issue.severity)}
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {issue.title} — <span className="font-mono">{issue.key}</span>
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{issue.explanation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
