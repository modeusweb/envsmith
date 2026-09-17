import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://envsmith.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EnvSmith — Safe .env Example Generator & Validator",
    template: "%s | EnvSmith",
  },
  description:
    "Free browser-based .env.example generator and Zod validator. EnvSmith parses dotenv files, masks secrets, infers types and syncs .env with .env.example — locally, with no uploads.",
  keywords: ["EnvSmith", ".env", "env.example", "zod", "environment variables", "validation", "developer tools"],
  applicationName: "EnvSmith",
  authors: [{ name: "modeusweb", url: "https://github.com/modeusweb" }],
  creator: "modeusweb",
  verification: {
    google: "w_s1YAdGDmNMm19tV4F6fl_4o15nDgnZGLM8ledX-f8",
    yandex: "81b79595ddb6cf9f",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EnvSmith — Safe .env Example Generator & Validator",
    description:
      "Generate safe .env.example files and runtime validation schemas — entirely in your browser with EnvSmith.",
    siteName: "EnvSmith",
    locale: "en_US",
    type: "website",
    url: "/",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "EnvSmith — safe .env.example generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnvSmith — Safe .env Example Generator & Validator",
    description:
      "Generate safe .env.example files and runtime validation schemas — locally, securely, and in seconds.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
