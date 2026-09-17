import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { ShieldCheckIcon, LockClosedIcon, EyeSlashIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "About",
  description:
    "EnvSmith is a privacy-first developer tool that generates safe .env.example files and runtime validation schemas entirely in your browser.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: LockClosedIcon,
    title: "No backend",
    text: "There is no API route, database or server action involved in parsing. Next.js is used purely as a frontend framework — the whole app is a static page.",
  },
  {
    icon: CpuChipIcon,
    title: "Local processing",
    text: "Your .env is parsed in your browser's memory. Nothing is uploaded, nothing is stored: no localStorage, no cookies, no IndexedDB. The only persisted preference is your theme choice.",
  },
  {
    icon: EyeSlashIcon,
    title: "Secrets stay hidden",
    text: "Secret values are masked by default and can be revealed one-by-one with the eye toggle. Generated .env.example files never contain secret values — in any mode.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Honest guarantees",
    text: "We only claim what the architecture actually delivers: local processing, no telemetry, no network calls with your data. No exaggerated security marketing.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title="About EnvSmith"
      subtitle="A developer tool that keeps .env and .env.example in sync — safely, locally, and in seconds."
    >
      <section aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-lg font-semibold tracking-tight">
          Why EnvSmith exists
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Every team knows the problem: local <code className="font-mono text-xs">.env</code> files change constantly —
          variables get added, renamed, and retired — while <code className="font-mono text-xs">.env.example</code>{" "}
          quietly rots. New teammates copy an outdated template, miss variables, and debug the app for an hour before
          realizing the environment is the culprit.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          EnvSmith fixes this in seconds: drop your real <code className="font-mono text-xs">.env</code>, review the
          detected variables (types, secrets, issues), and generate a safe template plus a runtime validation schema for
          your codebase. And because environment files often contain credentials, everything runs locally — your file
          never leaves the browser.
        </p>
      </section>

      <section aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="text-lg font-semibold tracking-tight">
          Private by design
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          EnvSmith processes your .env locally in your browser. We don&apos;t upload, store, or inspect your environment
          variables. There is no backend, no database, and no telemetry involved in parsing.
        </p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4"
            >
              <div className="flex items-center gap-2">
                <p.icon className="size-4 text-sky-600 dark:text-sky-400" aria-hidden />
                <h3 className="text-sm font-medium">{p.title}</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="text-lg font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="mt-4 flex flex-col sm:flex-row items-stretch gap-2 text-sm">
          {[
            { title: "Browser", desc: "You drop or paste a file" },
            { title: "Local processing", desc: "Parse & analyze in memory" },
            { title: "Output", desc: ".env.example + Zod schema" },
          ].map((step, i) => (
            <li
              key={step.title}
              className="flex-1 flex sm:flex-col items-center sm:items-start gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-zinc-500 dark:text-zinc-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Try EnvSmith
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
