import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Help & Guide — EnvSmith",
  description:
    "How to use EnvSmith: upload your .env, review variables, adjust types and secrets, generate .env.example and Zod schemas.",
};

const steps = [
  {
    title: "1. Load your .env",
    body: "Drag & drop the file, click the drop zone to browse, or press \"Paste .env text instead\" and paste the content. The file is read in your browser — nothing is uploaded.",
  },
  {
    title: "2. Review variables",
    body: "Each variable gets an inferred type (string, number, boolean, URL, JSON) with a confidence level, a secret classification, and a required/optional flag. Search, filter and sort help you move fast; Cmd/Ctrl+K jumps to search.",
  },
  {
    title: "3. Fix what's needed",
    body: "Click a variable to open the editor: change the type, correct the secret classification, toggle required, add a description. Descriptions become comments in the generated template.",
  },
  {
    title: "4. Compare (optional)",
    body: "On the Compare tab, drop an existing .env.example to see what's missing, what's extra, and where types diverge — green for synced, yellow for attention, red for issues.",
  },
  {
    title: "5. Generate",
    body: "Press Generate, pick a template mode (Smart, Safe or Template) and a schema format (Zod, TypeScript types, JSON Schema, dotenv notes). Copy to clipboard or download .env.example, env.ts and ENV_SETUP.md.",
  },
];

const faq = [
  {
    q: "Is my .env uploaded anywhere?",
    a: "No. Parsing happens entirely in your browser's memory. There is no backend, no database, and no telemetry. Closing the tab discards everything.",
  },
  {
    q: "Why are some values shown as ••••••?",
    a: "EnvSmith classifies variables as Secret, Likely secret, Public or Unknown. Secret-like values are masked by default. Click the eye icon next to a value to reveal it — only for that variable, only on your screen.",
  },
  {
    q: "What do the template modes do?",
    a: "Smart (default) clears secrets and keeps obviously safe values like PORT=3000 or DEBUG=true. Safe clears secrets but keeps all other values. Template clears every value — only names and comments remain.",
  },
  {
    q: "Why z.coerce.number() instead of z.number()?",
    a: "process.env values are always strings at runtime. Coercion makes PORT=3000 validate as a number, and booleans are handled with an explicit enum transform so only \"true\"/\"false\" pass.",
  },
  {
    q: "What file types and sizes are supported?",
    a: "Text files up to 5 MB: .env, .env.local, .env.development, .env.example, etc. Binary files are rejected. You can also paste text directly.",
  },
  {
    q: "My file has syntax errors — is that fatal?",
    a: "No. Malformed lines are reported in the Issues panel with a line number and a snippet, and parsing continues with the rest of the file.",
  },
];

export default function HelpPage() {
  return (
    <PageShell
      title="Help & Guide"
      subtitle="From drag & drop to generated files in three steps — here's the whole workflow."
    >
      <section aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className="text-lg font-semibold tracking-tight">
          Workflow
        </h2>
        <ol className="mt-5 space-y-3">
          {steps.map((s) => (
            <li key={s.title} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
              <h3 className="text-sm font-medium">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-semibold tracking-tight">
          FAQ
        </h2>
        <dl className="mt-5 space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-3"
            >
              <summary className="cursor-pointer text-sm font-medium marker:content-none list-none flex items-center justify-between gap-2 focus-visible:outline-2 focus-visible:outline-sky-500">
                {item.q}
                <span className="text-zinc-400 group-open:rotate-45 transition-transform" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{item.a}</p>
            </details>
          ))}
        </dl>
      </section>

      <section aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-lg font-semibold tracking-tight">
          Tips
        </h2>
        <ul className="mt-4 list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Cmd/Ctrl + K</span> focuses the variable
            search from anywhere in the workspace.
          </li>
          <li>Use the eye icon in the Value column to peek at a single masked value — other secrets stay hidden.</li>
          <li>The theme toggle (moon/sun) in the header is remembered between visits.</li>
          <li>Variable descriptions are optional — but they make the generated .env.example self-documenting.</li>
        </ul>
      </section>
    </PageShell>
  );
}
