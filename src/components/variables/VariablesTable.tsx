"use client";

import { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { EnvVariable, EnvIssue } from "@/types/analysis";
import { maskValue, typeLabel } from "@/lib/env/utils";

export type FilterKey =
  "all" | "secrets" | "warnings" | "numbers" | "urls" | "booleans" | "strings" | "required" | "optional";

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "secrets", label: "Secrets" },
  { key: "warnings", label: "Warnings" },
  { key: "numbers", label: "Numbers" },
  { key: "urls", label: "URLs" },
  { key: "booleans", label: "Booleans" },
  { key: "strings", label: "Strings" },
  { key: "required", label: "Required" },
  { key: "optional", label: "Optional" },
];

const TYPE_OPTIONS = ["string", "number", "boolean", "url", "json"] as const;

export function severityIcon(severity: EnvIssue["severity"]) {
  if (severity === "error") return <ExclamationTriangleIcon className="size-4 text-red-500" aria-hidden />;
  if (severity === "warning")
    return <ExclamationTriangleIcon className="size-4 text-amber-500" aria-hidden />;
  return <InformationCircleIcon className="size-4 text-sky-500" aria-hidden />;
}

export function isMasked(v: EnvVariable): boolean {
  return v.classification === "secret" || v.classification === "likely-secret";
}

function TypePill({ type }: { type: string }) {
  return (
    <span className="inline-block rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
      {typeLabel(type)}
    </span>
  );
}

export function SecretBadge({ classification }: { classification: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    secret: {
      label: "Secret",
      cls: "border-red-500/30 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    },
    "likely-secret": {
      label: "Likely",
      cls: "border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    },
    public: {
      label: "Public",
      cls: "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    unknown: {
      label: "Unknown",
      cls: "border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400",
    },
  };
  const c = config[classification] ?? config.unknown;
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium ${c.cls}`}>
      {c.label}
    </span>
  );
}

export function TypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: (typeof TYPE_OPTIONS)[number]) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as (typeof TYPE_OPTIONS)[number])}
      className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-sky-500"
      aria-label="Variable type"
    >
      {TYPE_OPTIONS.map((t) => (
        <option key={t} value={t}>
          {typeLabel(t)}
        </option>
      ))}
    </select>
  );
}

export interface VariablesTableProps {
  variables: EnvVariable[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onRemove: (key: string) => void;
}

function IssueBadges({ variable }: { variable: EnvVariable }) {
  if (variable.issues.length === 0) {
    return <CheckCircleIcon className="size-4 text-emerald-500" aria-label="No issues" role="img" />;
  }
  const max = variable.issues.filter((i) => i.severity !== "info");
  if (max.length === 0) {
    return <InformationCircleIcon className="size-4 text-sky-500" aria-label="Info" role="img" />;
  }
  return (
    <span title={max.map((i) => i.title).join("; ")} className="inline-flex items-center gap-1">
      <ExclamationTriangleIcon className="size-4 text-amber-500" aria-hidden />
      <span className="text-xs text-amber-600 dark:text-amber-400">{max.length}</span>
    </span>
  );
}

export function VariablesTable({ variables, selectedKey, onSelect, onRemove }: VariablesTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<{ key: "name" | "line"; dir: 1 | -1 }>({ key: "line", dir: 1 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => filterVariables(variables, query, filter, sort),
    [variables, query, filter, sort]
  );

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div>
      <TableToolbar
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {query || filter !== "all" ? "No variables match your search." : "Drop a .env file to get started."}
        </div>
      ) : (
        <>
          <DesktopTable
            variables={filtered}
            selectedKey={selectedKey}
            onSelect={onSelect}
            onRemove={onRemove}
            revealed={revealed}
            toggleReveal={toggleReveal}
          />
          <MobileCards
            variables={filtered}
            selectedKey={selectedKey}
            onSelect={onSelect}
            revealed={revealed}
            toggleReveal={toggleReveal}
          />
        </>
      )}
    </div>
  );
}

function filterVariables(
  variables: EnvVariable[],
  query: string,
  filter: FilterKey,
  sort: { key: "name" | "line"; dir: 1 | -1 }
): EnvVariable[] {
  let list = variables;
  if (query) list = list.filter((v) => v.key.toLowerCase().includes(query.toLowerCase()));
  const typeMap: Partial<Record<FilterKey, string>> = {
    numbers: "number",
    urls: "url",
    booleans: "boolean",
    strings: "string",
  };
  if (filter === "secrets")
    list = list.filter((v) => v.classification === "secret" || v.classification === "likely-secret");
  else if (filter === "warnings") list = list.filter((v) => v.issues.some((i) => i.severity !== "info"));
  else if (filter === "required") list = list.filter((v) => v.required && v.rawValue !== "");
  else if (filter === "optional") list = list.filter((v) => !(v.required && v.rawValue !== ""));
  else if (typeMap[filter]) list = list.filter((v) => v.type === typeMap[filter]);
  return [...list].sort((a, b) =>
    sort.key === "name" ? a.key.localeCompare(b.key) * sort.dir : (a.originalLine - b.originalLine) * sort.dir
  );
}

interface TableProps {
  variables: EnvVariable[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onRemove?: (key: string) => void;
  revealed: Set<string>;
  toggleReveal: (key: string) => void;
}

interface ToolbarProps {
  query: string;
  setQuery: (q: string) => void;
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  sort: { key: "name" | "line"; dir: 1 | -1 };
  setSort: (s: { key: "name" | "line"; dir: 1 | -1 }) => void;
}

function TableToolbar({ query, setQuery, filter, setFilter, sort, setSort }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
      <div className="relative flex-1">
        <MagnifyingGlassIcon
          className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search variables…"
          aria-label="Search variables"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-sky-500"
        />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium border transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ${
              filter === f.key
                ? "border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setSort({ key: sort.key === "line" ? "name" : "line", dir: sort.dir })}
        className="whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500 rounded px-1"
      >
        Sort: {sort.key === "line" ? "file order" : "name"}
      </button>
    </div>
  );
}

function ValueCell({
  v,
  revealed,
  toggleReveal,
  stopPropagation = true,
}: {
  v: EnvVariable;
  revealed: Set<string>;
  toggleReveal: (k: string) => void;
  stopPropagation?: boolean;
}) {
  const show = revealed.has(v.key) || !isMasked(v);
  return (
    <span className="inline-flex items-center gap-1 max-w-52">
      <span className="truncate font-mono text-xs">
        {show ? v.rawValue || <span className="text-zinc-400">—</span> : maskValue(v)}
      </span>
      {isMasked(v) && v.rawValue !== "" && (
        <button
          type="button"
          onClick={
            stopPropagation
              ? (e) => {
                  e.stopPropagation();
                  toggleReveal(v.key);
                }
              : () => toggleReveal(v.key)
          }
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-sky-500 rounded shrink-0"
          aria-label={revealed.has(v.key) ? `Hide value of ${v.key}` : `Reveal value of ${v.key}`}
        >
          {revealed.has(v.key) ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      )}
    </span>
  );
}

function DesktopTable({ variables, selectedKey, onSelect, onRemove, revealed, toggleReveal }: TableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead className="sticky top-14 bg-zinc-50 dark:bg-zinc-900 text-left text-xs text-zinc-500 dark:text-zinc-400 z-10">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">
              Variable
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Type
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Secret
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Required
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Value
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Description
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Issues
            </th>
            <th scope="col" className="px-3 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {variables.map((v) => (
            <tr
              key={v.key}
              onClick={() => onSelect(v.key)}
              className={`cursor-pointer transition-colors ${
                selectedKey === v.key
                  ? "bg-sky-50 dark:bg-sky-950/40"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <td className="px-3 py-2 font-mono text-xs font-medium">{v.key}</td>
              <td className="px-3 py-2">
                <TypePill type={v.type} />
              </td>
              <td className="px-3 py-2">
                <SecretBadge classification={v.classification} />
              </td>
              <td className="px-3 py-2">{v.required && v.rawValue !== "" ? "Yes" : "Optional"}</td>
              <td className="px-3 py-2">
                <ValueCell v={v} revealed={revealed} toggleReveal={toggleReveal} />
              </td>
              <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400 max-w-48 truncate">
                {v.description || "—"}
              </td>
              <td className="px-3 py-2">
                <IssueBadges variable={v} />
              </td>
              <td className="px-3 py-2 text-right">
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(v.key);
                    }}
                    className="p-1 rounded text-zinc-400 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-sky-500"
                    aria-label={`Remove ${v.key}`}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ variables, selectedKey, onSelect, revealed, toggleReveal }: TableProps) {
  return (
    <div className="md:hidden space-y-2">
      {variables.map((v) => (
        <div
          key={v.key}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(v.key)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(v.key)}
          className={`w-full text-left rounded-lg border p-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500 ${
            selectedKey === v.key
              ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-medium truncate">{v.key}</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <TypePill type={v.type} />
              <IssueBadges variable={v} />
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <SecretBadge classification={v.classification} />
            <ValueCell v={v} revealed={revealed} toggleReveal={toggleReveal} stopPropagation={false} />
          </div>
          {v.description && (
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">{v.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
