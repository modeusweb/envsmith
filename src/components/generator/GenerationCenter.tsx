"use client";

import { useMemo, useState } from "react";
import { XMarkIcon, DocumentTextIcon, CodeBracketIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { EnvVariable, ExampleMode } from "@/types/analysis";
import { generateExample } from "@/lib/env/example-generator";
import { generateZodSchema, type SchemaTarget } from "@/lib/env/zod-generator";
import { generateDocumentation } from "@/lib/env/docs-generator";
import { CodeBlock } from "@/components/code/CodeBlock";
import { downloadTextFile } from "@/utils/file";

const TARGETS: { key: SchemaTarget; label: string }[] = [
  { key: "zod", label: "Zod" },
  { key: "ts-types", label: "TypeScript types" },
  { key: "json-schema", label: "JSON Schema" },
  { key: "dotenv-validation", label: "dotenv notes" },
];

const MODES: { key: ExampleMode; label: string; hint: string }[] = [
  { key: "smart", label: "Smart", hint: "Secrets cleared, safe values kept" },
  { key: "safe", label: "Safe", hint: "Secrets cleared, values kept" },
  { key: "template", label: "Template", hint: "All values cleared" },
];

interface GenerationCenterProps {
  variables: EnvVariable[];
  mode: ExampleMode;
  onModeChange: (m: ExampleMode) => void;
  onClose: () => void;
}

export function GenerationCenter({ variables, mode, onModeChange, onClose }: GenerationCenterProps) {
  const [target, setTarget] = useState<SchemaTarget>("zod");

  const example = useMemo(
    () => generateExample(variables, { mode, includeDescriptions: true }),
    [variables, mode]
  );
  const schema = useMemo(() => generateZodSchema(variables, { target }), [variables, target]);
  const docs = useMemo(() => generateDocumentation(variables), [variables]);

  const downloadAll = () => {
    downloadTextFile(".env.example", example);
    downloadTextFile(
      target === "zod" ? "env.ts" : target === "json-schema" ? "env.schema.json" : "env-validation.txt",
      schema
    );
    downloadTextFile("ENV_SETUP.md", docs, "text/markdown");
  };

  const schemaFileName =
    target === "zod" ? "src/env.ts" : target === "json-schema" ? "env.schema.json" : "env-validation.txt";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Generate files">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="absolute inset-x-4 top-6 bottom-6 mx-auto max-w-5xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
          <h2 className="font-semibold">Generate</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadAll}
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-sky-500"
            >
              <ArrowDownTrayIcon className="size-4" aria-hidden />
              Download all
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-sky-500"
              aria-label="Close"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <span className="block text-sm font-medium mb-2">Template mode</span>
            <div className="grid sm:grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onModeChange(m.key)}
                  aria-pressed={mode === m.key}
                  className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ${
                    mode === m.key
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{m.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <section aria-label=".env.example output" className="space-y-1.5">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-medium">
                <DocumentTextIcon className="size-4 text-zinc-400" aria-hidden />
                .env.example
              </h3>
              <CodeBlock
                fileName=".env.example"
                code={example}
                language="env"
                mimeType="text/plain"
                collapsible
              />
            </section>

            <section aria-label="Validation schema output" className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <CodeBracketIcon className="size-4 text-zinc-400" aria-hidden />
                  Validation schema
                </h3>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as SchemaTarget)}
                  aria-label="Schema format"
                  className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-sky-500"
                >
                  {TARGETS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <CodeBlock
                fileName={schemaFileName}
                code={schema}
                language={target === "zod" || target === "ts-types" ? "ts" : "env"}
                mimeType={target === "json-schema" ? "application/json" : "text/plain"}
                collapsible
              />
            </section>
          </div>

          <section aria-label="Documentation output" className="space-y-1.5">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-medium">
              <DocumentTextIcon className="size-4 text-zinc-400" aria-hidden />
              Documentation (ENV_SETUP.md)
            </h3>
            <CodeBlock
              fileName="ENV_SETUP.md"
              code={docs}
              language="env"
              mimeType="text/markdown"
              collapsible
              maxHeightClass="max-h-64"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
