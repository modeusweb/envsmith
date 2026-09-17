"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowUpTrayIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { readFileAsText } from "@/utils/file";

interface DropZoneProps {
  onFile: (fileName: string, fileSize: number, content: string) => void;
  accept?: string;
  compact?: boolean;
  label?: string;
}

export function DropZone({ onFile, accept, compact = false, label }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const result = await readFileAsText(file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onFile(file.name, file.size, result.content);
    },
    [onFile]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={label ?? "Upload a file"}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`group cursor-pointer rounded-xl border-2 border-dashed text-center transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ${
          compact ? "p-4" : "p-10 sm:p-14"
        } ${
          dragging
            ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900/50"
        }`}
      >
        <ArrowUpTrayIcon
          className={`mx-auto text-zinc-400 dark:text-zinc-500 ${compact ? "size-5" : "size-8"} transition-colors group-hover:text-sky-500`}
          aria-hidden
        />
        <p className={`mt-3 font-medium text-zinc-900 dark:text-zinc-100 ${compact ? "text-sm" : ""}`}>
          {label ?? "Drop your .env here"}
        </p>
        {!compact && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">or click to browse</p>}
        {!compact && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <LockClosedIcon className="size-3.5" aria-hidden />
            Nothing is uploaded.
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? ".env,.env.example,.txt,text/plain"}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
