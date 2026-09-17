import type { EnvType, EnvSource, SecretClassification } from "./env";

export type IssueCode =
  | "duplicate"
  | "invalid-name"
  | "invalid-url"
  | "invalid-number"
  | "invalid-boolean"
  | "invalid-json"
  | "syntax"
  | "empty-required"
  | "suspicious-secret"
  | "type-conflict";

export type IssueSeverity = "error" | "warning" | "info";

export interface EnvIssue {
  code: IssueCode;
  severity: IssueSeverity;
  title: string;
  explanation: string;
  line?: number;
}

export interface EnvVariable {
  key: string;
  rawValue: string;
  inferredType: EnvType;
  type: EnvType;
  confidence: "high" | "medium" | "low";
  required: boolean;
  classification: SecretClassification;
  description: string;
  originalLine: number;
  source: EnvSource;
  issues: EnvIssue[];
  quoted: boolean;
  comment?: string;
  line?: number;
  exampleType?: EnvType;
  // compare-only variables (from .env.example)
  exampleOnly?: boolean;
}

export interface EnvFileStats {
  fileName: string;
  fileSize: number;
  variables: number;
  secrets: number;
  warnings: number;
}

export type ExampleMode = "smart" | "safe" | "template";

export interface EnvDiffItem {
  key: string;
  status:
    | "missing-in-example"
    | "present-in-both"
    | "only-in-example"
    | "type-mismatch"
    | "potential-secret-issue"
    | "duplicate"
    | "invalid-name"
    | "outdated";
}

export interface EnvDiff {
  items: EnvDiffItem[];
  summary: {
    synced: number;
    attention: number;
    issues: number;
  };
}
