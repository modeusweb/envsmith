import type { EnvVariable } from "@/types/analysis";
import type { ExampleMode } from "@/types/analysis";
import { isSecretLike } from "./utils";

export interface ExampleGenerationOptions {
  mode: ExampleMode;
  includeDescriptions: boolean;
}

function shouldKeepValue(v: EnvVariable, mode: ExampleMode): boolean {
  if (mode === "template") return false;
  if (isSecretLike(v)) return false;
  if (v.rawValue === "") return false;
  if (mode === "smart") {
    // Smart: keep only obviously safe, non-environment-specific values
    if (v.type === "boolean" && /^(true|false)$/i.test(v.rawValue)) return true;
    if (v.type === "number" && /^-?\d+(\.\d+)?$/.test(v.rawValue)) return true;
    // Quoted strings are typically app names/labels, safe to keep
    if (v.quoted && v.classification === "public") return true;
    return false;
  }
  // safe: keep all non-secret values
  return true;
}

function quoteIfNeeded(v: EnvVariable): string {
  if (v.rawValue === "") return "";
  if (/\s/.test(v.rawValue) || v.rawValue.includes("#") || v.quoted) {
    return `"${v.rawValue.replace(/"/g, '\\"')}"`;
  }
  return v.rawValue;
}

/**
 * Pure function: generate a safe .env.example from analyzed variables.
 * Secrets are ALWAYS cleared — never written to output.
 */
export function generateExample(variables: EnvVariable[], options: ExampleGenerationOptions): string {
  const lines: string[] = [];
  const seenDescriptions = new Set<string>();

  const groups = new Map<string, EnvVariable[]>();
  for (const v of variables) {
    if (v.exampleOnly) continue;
    const prefix = detectGroup(v.key);
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(v);
  }

  let first = true;
  for (const [group, vars] of groups) {
    if (!first) lines.push("");
    first = false;
    if (group !== "") {
      lines.push(`# ${group}`);
      lines.push("");
    }
    for (const v of vars) {
      if (options.includeDescriptions && v.description) {
        lines.push(...v.description.split("\n").map((l) => `# ${l}`));
      } else if (options.includeDescriptions && v.comment) {
        lines.push(...v.comment.split("\n").map((l) => `# ${l}`));
      }
      const keep = shouldKeepValue(v, options.mode);
      const value = keep ? quoteIfNeeded(v) : "";
      lines.push(`${v.key}=${value}`);
      seenDescriptions.add(v.key);
    }
  }

  return `${lines.join("\n")}\n`;
}

function detectGroup(key: string): string {
  if (/^(NEXT_PUBLIC|VITE|NUXT_PUBLIC|REACT_APP|EXPO_PUBLIC|PUBLIC)_/i.test(key))
    return "Client-side (public) variables";
  const knownPrefixes = [
    "DATABASE",
    "REDIS",
    "MONGO",
    "SMTP",
    "MAIL",
    "AUTH",
    "OAUTH",
    "STRIPE",
    "AWS",
    "S3",
    "LOG",
    "SESSION",
  ];
  const prefix = knownPrefixes.find((p) => key.toUpperCase().startsWith(`${p}_`));
  if (prefix) {
    const titles: Record<string, string> = {
      DATABASE: "Database",
      REDIS: "Redis",
      MONGO: "MongoDB",
      SMTP: "Email (SMTP)",
      MAIL: "Email (SMTP)",
      AUTH: "Authentication",
      OAUTH: "Authentication",
      STRIPE: "Payments (Stripe)",
      AWS: "AWS",
      S3: "AWS",
      LOG: "Logging",
      SESSION: "Session",
    };
    return titles[prefix];
  }
  return "";
}
