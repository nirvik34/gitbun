import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gitbun — AI-Powered Git Commit Messages",
  description: "Transform complex code diffs into clean, professional commit messages using AI. Built for the modern terminal workflow.",
  keywords: ["git", "commit", "AI", "conventional commits", "developer tools", "CLI"],
  authors: [{ name: "nirvik34", url: "https://github.com/nirvik34" }],
  openGraph: {
    title: "Gitbun — AI-Powered Git Commit Messages",
    description: "Transform complex code diffs into clean, professional commit messages using AI.",
    url: "https://github.com/nirvik34/gitbun",
    siteName: "Gitbun",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
