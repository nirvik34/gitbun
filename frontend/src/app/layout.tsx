import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "Gitbun — AI Commit Message Generator",
  description: "Gitbun analyzes your staged diffs and generates meaningful, context-aware Git commit messages using AI.",
  keywords:    ["git", "commit", "AI", "conventional commits", "developer tools", "CLI"],
  authors:     [{ name: "nirvik34", url: "https://github.com/nirvik34" }],
  openGraph: {
    title:       "Gitbun — AI Commit Message Generator",
    description: "Generate meaningful, context-aware Git commit messages in seconds.",
    url:         "https://github.com/nirvik34/gitbun",
    siteName:    "Gitbun",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
