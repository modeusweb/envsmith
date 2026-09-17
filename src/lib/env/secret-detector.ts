import type { SecretClassification } from "@/types/env";

const STRONG_SECRET_PATTERNS: RegExp[] = [
  /^(.*_)?(SECRET|SECRETS)$/i,
  /^(.*_)?(PASSWORD|PASSWD|PWD)$/i,
  /^(.*_)?(API_KEY|APIKEY|API_KEYS)$/i,
  /^(.*_)?(TOKEN|ACCESS_TOKEN|AUTH_TOKEN)$/i,
  /^(.*_)?PRIVATE_KEY$/i,
  /^(.*_)?(ACCESS_KEY|SECRET_KEY)$/i,
  /^(.*_)?(JWT|SESSION|ENCRYPTION|ENCRYPT|SIGNING)_?KEY$/i,
  /^(.*_)?CLIENT_SECRET$/i,
  /CREDENTIALS?$/i,
];

const MODERATE_SECRET_PATTERNS: RegExp[] = [
  /_KEY$/i,
  /^(.*_)?AUTH/i,
  /^(.*_)?STRIPE/i,
  /^(.*_)?SLACK.*$/i,
  /^(.*_)?SMTP_PASS/i,
  /^(.*_)?GITHUB/i,
  /^(.*_)?AWS_(SECRET|ACCESS)/i,
];

const PUBLIC_EXCLUSIONS: RegExp[] = [
  /^(.*_)?(PORT|HOST|DEBUG|NODE_ENV|APP_NAME|APP_URL|NAME|ENV|TZ)$/i,
  /^(NEXT_PUBLIC|VITE|NUXT_PUBLIC|PUBLIC|REACT_APP|EXPO_PUBLIC)_/i,
  /^(.*_)?(URL|HOST|ORIGIN|DOMAIN)s?$/i,
  /^(.*_)?(TIMEOUT|LIMIT|MAX|MIN|SIZE|COUNT|RETRIES?|TTL)$/i,
  /^(.*_)?(LOG|LOGGING|LOG_LEVEL|DEBUG|VERBOSE|TRACE)/i,
  /^(.*_)?(VERSION|BUILD|RELEASE|GIT_)/i,
];

const SECRET_VALUE_PATTERNS: RegExp[] = [
  /^sk-[A-Za-z0-9]/, // stripe-like keys
  /^gh[pousr]_[A-Za-z0-9]/, // github tokens
  /^AKIA[A-Z0-9]/, // aws access key
  /^xox[baprs]-/, // slack tokens
  /(?:[a-z]+:\/\/[^:/\s]+:[^@/\s]+@)/i, // credentials in URL (user:pass@)
];

const LIKELY_SECRET_VALUE_PATTERNS: RegExp[] = [
  /^eyJ[A-Za-z0-9_-]+\./, // JWT
  /^[A-Za-z0-9+/]{40,}={0,2}$/, // long base64-looking blobs
  /^[a-f0-9]{32,64}$/i, // hex hashes
];

/**
 * Pure function: classify whether a variable holds a secret.
 * Combines key name, value shape and known patterns — never just the name alone.
 */
export function classifySecret(key: string, rawValue: string): SecretClassification {
  const value = rawValue.trim();

  if (value === "") {
    // Empty values: fall back to name heuristics only
    if (STRONG_SECRET_PATTERNS.some((re) => re.test(key))) return "secret";
    return "unknown";
  }

  const strongName = STRONG_SECRET_PATTERNS.some((re) => re.test(key));
  const moderateName = MODERATE_SECRET_PATTERNS.some((re) => re.test(key));
  const secretValue = SECRET_VALUE_PATTERNS.some((re) => re.test(value));
  const likelyValue = LIKELY_SECRET_VALUE_PATTERNS.some((re) => re.test(value));
  const explicitlyPublic = PUBLIC_EXCLUSIONS.some((re) => re.test(key));

  if (explicitlyPublic && !secretValue && !likelyValue) {
    // NEXT_PUBLIC_* style vars are intentionally shipped to clients
    return "public";
  }

  if (strongName || secretValue) return "secret";
  if (moderateName && likelyValue) return "secret";
  if (moderateName || likelyValue) return "likely-secret";
  return "public";
}
