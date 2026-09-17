import { describe, expect, it } from "vitest";
import { inferType, validateValue } from "./type-inference";
import { classifySecret } from "./secret-detector";

describe("inferType", () => {
  const cases: Array<[string, boolean, string, string]> = [
    ["3000", false, "number", "high"],
    ["12.5", false, "number", "high"],
    ["true", false, "boolean", "high"],
    ["false", false, "boolean", "high"],
    ["True", false, "boolean", "medium"],
    ["https://example.com/path?a=b", false, "url", "high"],
    ["postgresql://admin:secret@localhost:5432/app", false, "url", "high"],
    ['{"foo":"bar"}', false, "json", "high"],
    ["my-app", false, "string", "medium"],
    ["hello world", true, "string", "medium"],
    ["", false, "unknown", "low"],
  ];

  for (const [value, quoted, type, confidence] of cases) {
    it(`infers ${type} for "${value}"`, () => {
      expect(inferType(value, quoted)).toEqual({ type, confidence });
    });
  }
});

describe("validateValue", () => {
  it("detects invalid numbers/booleans/urls/json", () => {
    expect(validateValue("number", "abc")).toBe("invalid-number");
    expect(validateValue("number", "-12.5")).toBeNull();
    expect(validateValue("boolean", "maybe")).toBe("invalid-boolean");
    expect(validateValue("url", "htp://example")).toBe("invalid-url");
    expect(validateValue("url", "https://example.com")).toBeNull();
    expect(validateValue("json", "{bad")).toBe("invalid-json");
    expect(validateValue("string", "anything")).toBeNull();
    expect(validateValue("number", "")).toBeNull();
  });
});

describe("classifySecret", () => {
  it("marks strong secret names as secret", () => {
    expect(classifySecret("JWT_SECRET", "abc")).toBe("secret");
    expect(classifySecret("API_KEY", "sk-live-123")).toBe("secret");
    expect(classifySecret("DATABASE_PASSWORD", "hunter2")).toBe("secret");
  });

  it("does not flag ordinary config", () => {
    expect(classifySecret("PORT", "3000")).toBe("public");
    expect(classifySecret("DEBUG", "true")).toBe("public");
    expect(classifySecret("NODE_ENV", "development")).toBe("public");
    expect(classifySecret("APP_NAME", "my-app")).toBe("public");
  });

  it("detects credentials inside URLs", () => {
    expect(classifySecret("SOME_CONN", "postgresql://admin:pass@host/db")).toBe("secret");
  });

  it("marks public prefixes as public", () => {
    expect(classifySecret("NEXT_PUBLIC_API_URL", "https://api.example.com")).toBe("public");
  });

  it("treats empty values via name heuristics", () => {
    expect(classifySecret("API_KEY", "")).toBe("secret");
    expect(classifySecret("PORT", "")).toBe("unknown");
  });

  it("classifies GitHub tokens / JWTs by value shape", () => {
    expect(classifySecret("CI_TOKEN_VALUE", "ghp_0123456789abcdef0123456789abcdef0123")).toBe("secret");
    expect(classifySecret("SOMETHING_ELSE", "eyJhbGciOiJIUzI1NiJ9.e30.sig")).toBe("likely-secret");
  });
});
