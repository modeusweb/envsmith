import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare .env Files — Find Missing & Outdated Variables",
  description:
    "Compare your local .env against an existing .env.example: find missing variables, extras, type mismatches and potential secret exposure. 100% local processing.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Compare .env Files — EnvSmith",
    description:
      "Find missing variables, extras, type mismatches and potential secret exposure between .env and .env.example.",
    url: "/compare",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "EnvSmith — compare .env files" }],
  },
  twitter: {
    title: "Compare .env Files — EnvSmith",
    description:
      "Find missing variables, extras, type mismatches and potential secret exposure between .env and .env.example.",
  },
  robots: { index: true, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
