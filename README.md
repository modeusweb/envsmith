# EnvSmith

**Keep your .env and .env.example in sync.**

EnvSmith is a privacy-first developer tool that turns your local `.env` into a safe, documented
`.env.example` and a production-ready runtime validation schema (Zod, TypeScript types, JSON Schema)
— **entirely in your browser**.

```
.env                        .env.example              src/env.ts
DATABASE_URL=••••••••  →    DATABASE_URL=        →    DATABASE_URL: z.string().url()
API_KEY=••••••••            API_KEY=                   API_KEY: z.string().min(1)
PORT=3000                   PORT=3000                  PORT: z.coerce.number()
```

## Features

- **Drag & drop / file picker / paste** — three ways to load your `.env`.
- **Robust dotenv parser** — quotes, `export`, comments, inline comments, values containing `=`,
  CRLF, duplicates; human-readable parse errors with line numbers.
- **Secret detection** — 4-level classification (Secret / Likely secret / Public / Unknown) based on
  key name, value shape and known patterns (JWTs, `sk-`/`ghp_` tokens, credentials in URLs,
  `NEXT_PUBLIC_*` exclusions).
- **Secret masking** — secrets are never shown by default; reveal per-value with the eye toggle.
  Generated files **never** contain secret values.
- **Type inference** — string / number / boolean / url / json with confidence levels; manually adjustable.
- **`.env.example` generation** — three modes: **Smart** (default: secrets cleared, obviously safe
  values kept), **Safe** (secrets cleared, values kept), **Template** (all values cleared).
  Optional per-variable descriptions become comments; variables are grouped (Database, Auth, Client-side…).
- **Validation schema generation** — Zod (primary), TypeScript `ProcessEnv` types, JSON Schema,
  dotenv-style notes. `process.env` strings are coerced safely (`z.coerce.number()`,
  `z.enum(["true","false"]).transform(...)`), with `.default()` / `.optional()` support.
- **Diff engine** — compare `.env` against an existing `.env.example`: missing variables, extras,
  type mismatches, potential secret exposure, synced/attention/issue summary.
- **Issues panel** — duplicates, invalid names, malformed lines, invalid URLs/numbers/booleans/JSON.
- **Documentation** — one-click `ENV_SETUP.md` with a variables table.
- **Copy & download** — clipboard and `Blob`-based downloads for every artifact.

## Privacy

**100% local processing.** Your `.env` never leaves your browser:

- no uploads, no API routes, no server actions — parsing runs in the client;
- nothing stored: no localStorage/cookies/IndexedDB (the only preference kept is the theme);
- secrets are masked in the UI and excluded from all generated files;
- file size is capped at 5 MB and binary content is rejected;
- values are rendered as React text nodes only — never `dangerouslySetInnerHTML`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (parser, inference, secrets, generators, diff, security) |
| `npm run icons` | Regenerate favicons & OG image from `assets/logo.svg` (requires `sharp`) |

## UI checks

A Playwright smoke script exercises the main flows end-to-end (paste → analyze → edit → generate,
masking, keyboard navigation, mobile layout, a11y basics). Start the dev server, then:

```bash
node scripts/ui-check.mjs   # prints [error]/[warning]/✓ findings
```

## Project structure

```
src/
  app/               # Next.js App Router (layout, page, icons, OG image)
  components/
    landing/         # hero, example preview, privacy section
    upload/          # drop zone (drag & drop / picker)
    workspace/       # workspace shell, tabs, issues panel
    variables/       # table (desktop) + cards (mobile), editor drawer
    compare/         # .env vs .env.example diff
    generator/       # generation center (example, schema, docs)
    code/            # lightweight code viewer with copy/download
    ui/              # header, shared bits
  lib/env/           # pure domain logic: parser, analyzer, secret-detector,
                     # type-inference, example/zod/docs generators, diff, validators
  hooks/             # useEnvWorkspace (useReducer state), useTheme
  types/             # EnvVariable, issues, diff models
scripts/             # icon generation (sharp), Playwright UI smoke check
```

Domain logic is pure and framework-agnostic — every generator/parser function is testable without React.

## Tech stack

Next.js (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Heroicons ·
Vitest · Playwright · sharp (asset pipeline). No backend, no database, no analytics.
