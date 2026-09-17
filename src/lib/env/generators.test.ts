import { describe, expect, it } from "vitest";
import { analyzeVariables } from "./analyzer";
import { generateExample } from "./example-generator";
import { generateZodSchema } from "./zod-generator";
import { generateDocumentation } from "./docs-generator";
import { compareEnvs } from "./diff";
import { parseEnv } from "./parser";

const SAMPLE = [
  "DATABASE_URL=postgresql://admin:secret@localhost:5432/app",
  "PORT=3000",
  "DEBUG=true",
  "API_KEY=supersecret",
  'APP_NAME="My App"',
].join("\n");

function analyze(content: string) {
  return analyzeVariables(content).variables;
}

describe("analyzeVariables", () => {
  it("analyzes the sample file end-to-end", () => {
    const vars = analyze(SAMPLE);
    expect(vars.map((v) => v.key)).toEqual(["DATABASE_URL", "PORT", "DEBUG", "API_KEY", "APP_NAME"]);
    expect(vars[0].type).toBe("url");
    expect(vars[0].classification).toBe("secret"); // credentials in URL
    expect(vars[1].type).toBe("number");
    expect(vars[2].type).toBe("boolean");
    expect(vars[3].classification).toBe("secret");
  });
});

describe("generateExample", () => {
  it("clears secrets in every mode and never leaks them", () => {
    const vars = analyze(SAMPLE);
    for (const mode of ["smart", "safe", "template"] as const) {
      const out = generateExample(vars, { mode, includeDescriptions: true });
      expect(out).not.toContain("supersecret");
      expect(out).not.toContain("secret@");
      expect(out).toContain("API_KEY=");
    }
  });

  it("keeps safe defaults in smart mode", () => {
    const vars = analyze(SAMPLE);
    const out = generateExample(vars, { mode: "smart", includeDescriptions: false });
    expect(out).toContain("PORT=3000");
    expect(out).toContain("DEBUG=true");
    expect(out).toContain('APP_NAME="My App"');
    expect(out).toContain("DATABASE_URL=");
  });

  it("template mode clears everything", () => {
    const vars = analyze(SAMPLE);
    const out = generateExample(vars, { mode: "template", includeDescriptions: false });
    expect(out).toContain("PORT=");
    expect(out).not.toContain("PORT=3000");
  });

  it("includes descriptions as comments", () => {
    const vars = analyze("PORT=3000");
    vars[0].description = "Application port";
    const out = generateExample(vars, { mode: "smart", includeDescriptions: true });
    expect(out).toContain("# Application port");
  });
});

describe("generateZodSchema", () => {
  it("generates production-friendly zod code", () => {
    const vars = analyze(SAMPLE);
    vars[1].description = "Server port";
    const out = generateZodSchema(vars, { target: "zod" });
    expect(out).toContain('import { z } from "zod"');
    expect(out).toContain("DATABASE_URL: z.string().url()");
    expect(out).toContain("PORT: z.coerce.number().int().positive()");
    expect(out).toContain('z.enum(["true", "false"]).transform((v) => v === "true")');
    expect(out).toContain("API_KEY: z.string().min(1)");
    expect(out).toContain("// Server port");
    expect(out).toContain("export const env = envSchema.parse(process.env);");
  });

  it("respects required/optional and defaults", () => {
    const vars = analyze("PORT=3000\nNAME=my-app\nOPTIONAL=");
    vars[0].required = true;
    vars[1].required = false;
    const out = generateZodSchema(vars, { target: "zod" });
    expect(out).toContain("PORT: z.coerce.number().int().positive()");
    expect(out).toContain('NAME: z.string().default("my-app")');
    expect(out).toMatch(/OPTIONAL: z\.string\(\)\.optional\(\)/);
  });

  it("generates valid-looking TypeScript types and JSON schema", () => {
    const vars = analyze("PORT=3000\nDEBUG=true");
    expect(generateZodSchema(vars, { target: "ts-types" })).toContain("PORT: number;");
    expect(generateZodSchema(vars, { target: "json-schema" })).toContain('"enum":["true","false"]');
  });
});

describe("generateDocumentation", () => {
  it("renders a markdown table without leaking raw values", () => {
    const vars = analyze(SAMPLE);
    const doc = generateDocumentation(vars);
    expect(doc).toContain("| `DATABASE_URL` |");
    expect(doc).not.toContain("supersecret");
  });
});

describe("compareEnvs", () => {
  it("detects missing, extra, in-sync and mismatched variables", () => {
    const env = analyze("A=1\nB=hello\nPORT=3000");
    const ex = analyze("A=1\nPORT=text\nOLD=1");
    ex[1].exampleType = "string";
    const diff = compareEnvs(env, ex);
    const status = (k: string) => diff.items.find((i) => i.key === k)?.status;
    expect(status("A")).toBe("present-in-both");
    expect(status("B")).toBe("missing-in-example");
    expect(status("OLD")).toBe("only-in-example");
    expect(status("PORT")).toBe("type-mismatch");
  });
});

describe("security edge cases", () => {
  it("handles huge .env files without error", () => {
    const lines = Array.from({ length: 20_000 }, (_, i) => `VAR_${i}=value_${i}`);
    const r = parseEnv(lines.join("\n"));
    expect(r.entries).toHaveLength(20_000);
    expect(r.errors).toHaveLength(0);
  });

  it("neutralizes HTML/JS-looking content by keeping it as inert text", () => {
    const r = parseEnv('PAYLOAD="</script><script>alert(1)</script>"');
    expect(r.entries[0].rawValue).toBe("</script><script>alert(1)</script>");
  });

  it("handles backslashes and terminal escape sequences as text", () => {
    const r = parseEnv("ESCAPE=\\x1b[31mred\\x1b[0m");
    expect(r.entries[0].rawValue).toBe("\\x1b[31mred\\x1b[0m");
  });

  it("continues parsing after malformed lines", () => {
    const r = parseEnv("GOOD=1\n(((bad\nALSO_GOOD=2");
    expect(r.entries.map((e) => e.key)).toEqual(["GOOD", "ALSO_GOOD"]);
  });
});
