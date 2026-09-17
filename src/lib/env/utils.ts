import type { EnvVariable } from "@/types/analysis";

/**
 * Heuristic used by generators to decide masking.
 * Secrets and "likely secrets" are always treated as secret for output purposes.
 */
export function isSecretLike(v: EnvVariable): boolean {
  return (
    v.classification === "secret" || v.classification === "likely-secret" || v.classification === "unknown"
  );
}

export function maskValue(v: EnvVariable): string {
  if (!isSecretLike(v) || v.rawValue === "") return v.rawValue;
  return "•".repeat(Math.min(Math.max(v.rawValue.length, 8), 16));
}

/** Human-readable type label for the UI. */
export function typeLabel(type: string): string {
  switch (type) {
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    case "url":
      return "URL";
    case "json":
      return "JSON";
    case "string":
      return "String";
    default:
      return "Unknown";
  }
}
