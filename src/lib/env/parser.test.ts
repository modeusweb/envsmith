import { describe, expect, it } from "vitest";
import { parseEnv, isValidEnvName } from "./parser";

describe("parseEnv", () => {
  it("parses basic KEY=value pairs", () => {
    const r = parseEnv("DATABASE_URL=postgresql://localhost/db\nPORT=3000");
    expect(r.entries).toHaveLength(2);
    expect(r.entries[0]).toMatchObject({
      key: "DATABASE_URL",
      rawValue: "postgresql://localhost/db",
      quoted: false,
    });
    expect(r.entries[1]).toMatchObject({ key: "PORT", rawValue: "3000" });
    expect(r.errors).toHaveLength(0);
  });

  it("parses quoted values", () => {
    const r = parseEnv("A=\"hello world\"\nB='single quoted'");
    expect(r.entries[0]).toMatchObject({ rawValue: "hello world", quoted: true });
    expect(r.entries[1]).toMatchObject({ rawValue: "single quoted", quoted: true });
  });

  it("keeps = inside values", () => {
    const r = parseEnv("KEY=value=with=equals");
    expect(r.entries[0].rawValue).toBe("value=with=equals");
  });

  it("handles empty values", () => {
    const r = parseEnv("EMPTY=");
    expect(r.entries[0]).toMatchObject({ key: "EMPTY", rawValue: "" });
  });

  it("skips comments and blank lines", () => {
    const r = parseEnv("# comment\n\nA=1\n  # indented comment");
    expect(r.entries).toHaveLength(1);
  });

  it("supports export keyword and trims whitespace", () => {
    const r = parseEnv("export  KEY=value\n  OTHER =  spaced  ");
    expect(r.entries[0]).toMatchObject({ key: "KEY", rawValue: "value", exportKeyword: true });
    expect(r.entries[1]).toMatchObject({ key: "OTHER", rawValue: "spaced" });
  });

  it("strips inline comments on unquoted values only", () => {
    const r = parseEnv('URL=https://example.com/path?a=b # inline\nNAME="has # hash"');
    expect(r.entries[0].rawValue).toBe("https://example.com/path?a=b");
    expect(r.entries[1].rawValue).toBe("has # hash");
  });

  it("reports syntax errors with line numbers", () => {
    const r = parseEnv("OK=1\nnot a pair\nNO_VALUE");
    expect(r.errors).toHaveLength(2);
    expect(r.errors[0].line).toBe(2);
  });

  it("reports unterminated quotes", () => {
    const r = parseEnv('BAD="unterminated');
    expect(r.errors[0].message).toMatch(/Unterminated/);
  });

  it("reports missing variable name", () => {
    const r = parseEnv("=novalue");
    expect(r.errors[0].message).toMatch(/Expected a variable name/);
  });

  it("detects duplicates and preserves order", () => {
    const r = parseEnv("A=1\nB=2\nA=3");
    expect(r.order).toEqual(["A", "B"]);
    expect(r.entries[2].duplicate).toBe(true);
  });

  it("handles CRLF line endings", () => {
    const r = parseEnv("A=1\r\nB=2\r\n");
    expect(r.entries).toHaveLength(2);
  });
});

describe("isValidEnvName", () => {
  it("accepts valid names", () => {
    expect(isValidEnvName("NEXT_PUBLIC_API_URL")).toBe(true);
    expect(isValidEnvName("_private")).toBe(true);
  });
  it("rejects invalid names", () => {
    expect(isValidEnvName("1BAD")).toBe(false);
    expect(isValidEnvName("HAS SPACE")).toBe(false);
    expect(isValidEnvName("DASH-NAME")).toBe(false);
  });
});
