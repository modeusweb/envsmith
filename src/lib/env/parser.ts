import type { EnvParseError, ParsedEntry } from "@/types/env";

/**
 * Pure dotenv parser. Supports:
 * KEY=value, KEY="value", KEY='value', export KEY=value, # comments,
 * inline comments for unquoted values, values containing "=" and spaces.
 * Reports syntax errors per line and continues parsing the rest.
 */
export function parseEnv(content: string): {
  entries: ParsedEntry[];
  errors: EnvParseError[];
  order: string[];
} {
  const entries: ParsedEntry[] = [];
  const errors: EnvParseError[] = [];
  const seen = new Set<string>();
  const order: string[] = [];
  const lines = splitLines(content);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNo = i + 1;
    const line = raw.trim();

    if (line === "") continue;

    // Full-line comment
    if (line.startsWith("#")) {
      continue;
    }

    // Strip optional `export` keyword
    let body = line;
    let exportKeyword = false;
    const exportMatch = /^export\s+/.exec(body);
    if (exportMatch) {
      exportKeyword = true;
      body = body.slice(exportMatch[0].length);
    }

    const eq = body.indexOf("=");
    if (eq === -1) {
      errors.push({
        line: lineNo,
        message: body.includes(":")
          ? "Expected '=' to separate the variable name from its value."
          : "Could not parse line. Expected a KEY=value pair.",
        snippet: raw,
      });
      continue;
    }

    const key = body.slice(0, eq).trim();
    if (!key) {
      errors.push({
        line: lineNo,
        message: "Expected a variable name before '='.",
        snippet: raw,
      });
      continue;
    }
    if (!isValidEnvName(key)) {
      errors.push({
        line: lineNo,
        message: `"${truncate(key, 40)}" is not a valid variable name. Use letters, digits, underscores; do not start with a digit.`,
        snippet: raw,
      });
      continue;
    }

    let rest = body.slice(eq + 1).trimStart();
    let rawValue = "";
    let quoted = false;

    if (rest.startsWith('"') || rest.startsWith("'")) {
      const quote = rest[0];
      const close = findClosingQuote(rest, quote);
      if (close === -1) {
        errors.push({
          line: lineNo,
          message: `Unterminated ${quote === '"' ? "double" : "single"} quote starting the value.`,
          snippet: raw,
        });
        continue;
      }
      rawValue = rest.slice(1, close);
      quoted = true;
      // ignore anything after closing quote (usually whitespace or comment)
    } else {
      // Unquoted value: strip inline comment (# preceded by whitespace)
      const commentIdx = findInlineCommentIndex(rest);
      if (commentIdx !== -1) {
        rest = rest.slice(0, commentIdx).trimEnd();
      }
      rawValue = rest.trim();
    }

    const duplicate = seen.has(key);
    if (!duplicate) {
      seen.add(key);
      order.push(key);
    }
    entries.push({ key, rawValue, quoted, line: lineNo, exportKeyword, duplicate });
  }

  return { entries, errors, order };
}

/** Find the closing quote index, honoring backslash escapes for double quotes. */
function findClosingQuote(s: string, quote: string): number {
  for (let i = 1; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\" && quote === '"') {
      i++;
      continue;
    }
    if (ch === quote) return i;
  }
  return -1;
}

/** Detect a standalone `#` comment start in an unquoted value. */
function findInlineCommentIndex(value: string): number {
  let i = 0;
  while (i < value.length) {
    if (value[i] === "#" && (i === 0 || /\s/.test(value[i - 1]))) return i;
    i++;
  }
  return -1;
}

export function isValidEnvName(name: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
}

function splitLines(content: string): string[] {
  return content.split(/\r\n|\n|\r/);
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}
