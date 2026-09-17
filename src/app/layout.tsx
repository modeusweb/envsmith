import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "EnvSmith — Safe .env Example Generator & Validator",
  description:
    "EnvSmith helps you generate safe .env.example files and environment validation schemas (Zod) directly in your browser. 100% local processing — your .env never leaves your browser.",
  keywords: ["EnvSmith", ".env", "env.example", "zod", "environment variables", "validation", "developer tools"],
  applicationName: "EnvSmith",
  authors: [{ name: "EnvSmith" }],
  openGraph: {
    title: "EnvSmith — Safe .env Example Generator & Validator",
    description:
      "Generate safe .env.example files and runtime validation schemas — entirely in your browser with EnvSmith.",
    siteName: "EnvSmith",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "EnvSmith" }],
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
