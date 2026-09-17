import type { EnvParseError, ParsedEntry } from "@/types/env";
import type { EnvIssue, EnvVariable } from "@/types/analysis";
import { parseEnv, isValidEnvName } from "./parser";
import { inferType, validateValue } from "./type-inference";
import { classifySecret } from "./secret-detector";

export interface AnalyzeOptions {
  source?: "env" | "example";
  defaultRequired?: boolean;
}

/**
 * Pure function: analyze parsed entries into typed, classified EnvVariables.
 */
export function analyzeVariables(
  input: ParsedEntry[] | string,
  options: AnalyzeOptions = {}
): { variables: EnvVariable[]; errors: EnvParseError[] } {
  const source = options.source ?? "env";
  const parsed = typeof input === "string" ? parseEnv(input) : { entries: input, errors: [], order: [] };

  const seenKeys = new Set<string>();
  const variables: EnvVariable[] = [];

  for (const entry of parsed.entries) {
    const issues: EnvIssue[] = [];
    const inferred = inferType(entry.rawValue, entry.quoted);
    const classification = classifySecret(entry.key, entry.rawValue);
    const required = options.defaultRequired ?? true;
    const validName = isValidEnvName(entry.key);

    if (entry.duplicate) {
      issues.push({
        code: "duplicate",
        severity: "warning",
        title: "Duplicate variable",
        explanation: `"${entry.key}" is defined more than once. The last value wins at runtime, which is rarely intended.`,
      });
    }
    if (!validName) {
      issues.push({
        code: "invalid-name",
        severity: "error",
        title: "Invalid variable name",
        explanation: `"${entry.key}" contains characters that are invalid in .env variable names.`,
        line: entry.line,
      });
    }
    const invalid = validateValue(inferred.type === "unknown" ? "string" : inferred.type, entry.rawValue);
    if (invalid) {
      const labels: Record<string, string> = {
        "invalid-url": "Invalid URL",
        "invalid-number": "Invalid number",
        "invalid-boolean": "Invalid boolean",
        "invalid-json": "Invalid JSON",
      };
      issues.push({
        code: invalid,
        severity: "warning",
        title: labels[invalid],
        explanation: `"${entry.key}" looks like a ${inferred.type}, but the value doesn't match the expected format.`,
        line: entry.line,
      });
    }
    if (entry.rawValue === "" && required && classification === "public") {
      issues.push({
        code: "empty-required",
        severity: "info",
        title: "Empty required value",
        explanation: `"${entry.key}" is empty. It will be treated as an optional template placeholder or marked required in validation.`,
      });
    }

    // Track duplicates across all entries (first occurrence flagged later)
    const isDuplicate = seenKeys.has(entry.key);
    seenKeys.add(entry.key);

    variables.push({
      key: entry.key,
      rawValue: entry.rawValue,
      inferredType: inferred.type,
      type: inferred.type === "unknown" ? "string" : inferred.type,
      confidence: inferred.confidence,
      required,
      classification,
      description: "",
      originalLine: entry.line,
      source,
      issues: isDuplicate ? issues.filter((i) => i.code !== "duplicate") : issues,
      quoted: entry.quoted,
      comment: entry.comment,
      line: entry.line,
    });
  }

  // Flag first occurrences of duplicated keys
  const keyCounts = new Map<string, number>();
  for (const v of variables) keyCounts.set(v.key, (keyCounts.get(v.key) ?? 0) + 1);
  for (const v of variables) {
    if ((keyCounts.get(v.key) ?? 0) > 1) {
      v.issues = [
        ...v.issues.filter((i) => i.code !== "duplicate"),
        {
          code: "duplicate",
          severity: "warning",
          title: "Duplicate variable",
          explanation: `"${v.key}" is defined more than once in the file.`,
          line: v.originalLine,
        },
      ];
    }
  }

  return { variables, errors: parsed.errors };
}

export function countIssues(variables: EnvVariable[]): number {
  return variables.reduce((acc, v) => acc + v.issues.filter((i) => i.severity !== "info").length, 0);
}
