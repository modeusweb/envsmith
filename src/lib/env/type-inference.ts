import type { EnvType } from "@/types/env";

export interface TypeInferenceResult {
  type: EnvType;
  confidence: "high" | "medium" | "low";
}

/**
 * Pure function: infer the likely type of an .env value.
 * process.env values are always strings, so we analyze the raw text.
 */
export function inferType(rawValue: string, quoted: boolean): TypeInferenceResult {
  const v = rawValue.trim();

  if (v === "") return { type: "unknown", confidence: "low" };

  if (!quoted) {
    if (/^(true|false|yes|no|on|off|1|0)$/i.test(v)) {
      const exact = /^(true|false|1|0)$/.test(v);
      return { type: "boolean", confidence: exact ? "high" : "medium" };
    }
    if (/^-?\d+$/.test(v)) return { type: "number", confidence: "high" };
    if (/^-?\d*\.\d+$/.test(v)) return { type: "number", confidence: "high" };
  }

  if (isUrl(v)) return { type: "url", confidence: "high" };

  if (!quoted && (v.startsWith("{") || v.startsWith("["))) {
    try {
      JSON.parse(v);
      return { type: "json", confidence: "high" };
    } catch {
      // fall through
    }
  }

  if (!quoted && /^[\w.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) {
    return { type: "string", confidence: "high" };
  }

  return { type: "string", confidence: "medium" };
}

export function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (
      u.protocol === "http:" ||
      u.protocol === "https:" ||
      u.protocol === "ws:" ||
      u.protocol === "wss:" ||
      u.protocol === "postgresql:" ||
      u.protocol === "mysql:" ||
      u.protocol === "mongodb:" ||
      u.protocol === "redis:" ||
      u.protocol === "amqp:"
    );
  } catch {
    return false;
  }
}

/** Validate a value against its declared type. Returns an issue code or null. */
export function validateValue(
  type: EnvType,
  value: string
): "invalid-url" | "invalid-number" | "invalid-boolean" | "invalid-json" | null {
  if (value === "") return null;
  switch (type) {
    case "number":
      return /^-?\d+(\.\d+)?$/.test(value) ? null : "invalid-number";
    case "boolean":
      return /^(true|false)$/i.test(value) ? null : "invalid-boolean";
    case "url":
      return isUrl(value) ? null : "invalid-url";
    case "json":
      try {
        JSON.parse(value);
        return null;
      } catch {
        return "invalid-json";
      }
    default:
      return null;
  }
}
