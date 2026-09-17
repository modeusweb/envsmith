export type EnvType = "string" | "number" | "boolean" | "url" | "json" | "unknown";

export type SecretClassification = "secret" | "likely-secret" | "public" | "unknown";

export type EnvSource = "env" | "example" | "user";

export interface EnvParseError {
  line: number;
  message: string;
  snippet: string;
}

export interface ParsedEntry {
  key: string;
  rawValue: string;
  quoted: boolean;
  line: number;
  comment?: string;
  exportKeyword: boolean;
  duplicate: boolean;
}

export interface EnvParseResult {
  entries: ParsedEntry[];
  errors: EnvParseError[];
  comments: Map<string, string[]>;
  order: string[];
}
