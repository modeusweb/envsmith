"use client";

import { useState } from "react";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { copyToClipboard, downloadTextFile } from "@/utils/file";

interface CodeBlockProps {
  fileName: string;
  code: string;
  language?: string;
  mimeType?: string;
  collapsible?: boolean;
  maxHeightClass?: string;
}

/** Simple token-based highlighting — content is rendered as text nodes only. */
function highlightLine(line: string, language: string): React.ReactNode {
  if (language === "env") {
    if (line.trimStart().startsWith("#")) {
      return <span className="text-zinc-500">{line}</span>;
    }
    const eq = line.indexOf("=");
    if (eq === -1) return line;
    return (
      <>
        <span className="text-sky-600 dark:text-sky-400">{line.slice(0, eq)}</span>
        <span className="text-zinc-400">=</span>
        <span className="text-emerald-700 dark:text-emerald-400">{line.slice(eq + 1)}</span>
      </>
    );
  }
  // ts/other: minimal keyword + comment highlighting
  if (/^\s*(\/\/|\/\*)/.test(line)) {
    return <span className="text-zinc-500 dark:text-zinc-500">{line}</span>;
  }
  const parts = line.split(
    /(\b(?:import|from|export|const|type|declare|namespace|interface|global|return|try|catch|new|z|true|false)\b)/g
  );
  return parts.map((part, i) =>
    /^(import|from|export|const|type|declare|namespace|interface|global|return|try|catch|new)$/.test(part) ? (
      <span key={i} className="text-violet-600 dark:text-violet-400">
        {part}
      </span>
    ) : /^(z|true|false)$/.test(part) ? (
      <span key={i} className="text-amber-600 dark:text-amber-400">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function CodeBlock({
  fileName,
  code,
  language = "ts",
  mimeType,
  collapsible = false,
  maxHeightClass = "max-h-[420px]",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
        <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 truncate">{fileName}</span>
        <div className="flex items-center gap-1 shrink-0">
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 focus-visible:outline-2 focus-visible:outline-sky-500"
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Expand code" : "Collapse code"}
            >
              <ChevronDownIcon className={`size-4 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label="Copy code"
          >
            {copied ? (
              <CheckIcon className="size-4 text-emerald-500" />
            ) : (
              <ClipboardDocumentIcon className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => downloadTextFile(fileName, code, mimeType)}
            className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 focus-visible:outline-2 focus-visible:outline-sky-500"
            aria-label={`Download ${fileName}`}
          >
            <ArrowDownTrayIcon className="size-4" />
          </button>
        </div>
      </div>
      <pre
        className={`overflow-auto font-mono text-xs leading-5 p-3 ${collapsed ? "hidden" : `${maxHeightClass}`} scroll-smooth`}
      >
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex whitespace-pre">
              <span className="select-none w-8 shrink-0 text-right pr-3 text-zinc-400 dark:text-zinc-600">
                {i + 1}
              </span>
              <span className="text-zinc-800 dark:text-zinc-300">
                {highlightLine(line, language) as React.ReactNode}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
