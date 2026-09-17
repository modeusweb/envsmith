import type { EnvVariable } from "@/types/analysis";
import { generateZodSchema } from "./zod-generator";

/** Single-variable Zod rule preview for the editor drawer. */
export function zodRuleForVariable(v: EnvVariable): string {
  const schema = generateZodSchema([v], { target: "zod" });
  const match = /\n  [A-Za-z_][A-Za-z0-9_]*: (.*),\n[\s\S]*?/.exec(schema.slice(0, schema.indexOf("\n}")));
  return match ? match[1] : `${v.key}: z.string()`;
}
