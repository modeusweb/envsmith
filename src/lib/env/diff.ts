import type { EnvVariable, EnvDiff, EnvDiffItem } from "@/types/analysis";

/**
 * Pure function: compare .env variables against .env.example variables.
 */
export function compareEnvs(envVars: EnvVariable[], exampleVars: EnvVariable[]): EnvDiff {
  const items: EnvDiffItem[] = [];
  const envMap = new Map(envVars.map((v) => [v.key, v]));
  const exampleMap = new Map(exampleVars.map((v) => [v.key, v]));

  for (const v of envVars) {
    const ex = exampleMap.get(v.key);
    if (!ex) {
      items.push({ key: v.key, status: "missing-in-example" });
      continue;
    }
    const exType = ex.exampleType ?? ex.type;
    if (v.type !== exType) {
      items.push({ key: v.key, status: "type-mismatch" });
      continue;
    }
    if ((v.classification === "secret" || v.classification === "likely-secret") && v.rawValue !== "") {
      items.push({ key: v.key, status: "potential-secret-issue" });
      continue;
    }
    items.push({ key: v.key, status: "present-in-both" });
  }

  for (const ex of exampleVars) {
    if (!envMap.has(ex.key)) {
      items.push({ key: ex.key, status: "only-in-example" });
    }
  }

  const attention = new Set(["missing-in-example", "type-mismatch", "outdated", "potential-secret-issue"]);
  const issues = new Set(["type-mismatch", "potential-secret-issue", "invalid-name", "duplicate"]);

  return {
    items,
    summary: {
      synced: items.filter((i) => i.status === "present-in-both").length,
      attention: items.filter((i) => attention.has(i.status)).length,
      issues: items.filter((i) => issues.has(i.status)).length,
    },
  };
}

export function diffStatusSeverity(status: EnvDiffItem["status"]): "green" | "yellow" | "red" | "gray" {
  switch (status) {
    case "present-in-both":
      return "green";
    case "missing-in-example":
    case "only-in-example":
    case "outdated":
      return "yellow";
    case "type-mismatch":
    case "potential-secret-issue":
    case "duplicate":
    case "invalid-name":
      return "red";
    default:
      return "gray";
  }
}

export function diffStatusLabel(status: EnvDiffItem["status"]): string {
  switch (status) {
    case "missing-in-example":
      return "Missing in .env.example";
    case "present-in-both":
      return "In sync";
    case "only-in-example":
      return "Only in .env.example";
    case "type-mismatch":
      return "Type mismatch";
    case "potential-secret-issue":
      return "Potential secret exposure";
    case "duplicate":
      return "Duplicate variable";
    case "invalid-name":
      return "Invalid variable name";
    case "outdated":
      return "Potentially outdated";
    default:
      return "Informational";
  }
}
