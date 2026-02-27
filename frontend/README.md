# gitbun-web

Marketing site + interactive playground for [Gitbun](https://github.com/nirvik34/gitbun) — the AI-powered Git commit message generator.

## Stack

- **Next.js 15** — App Router, TypeScript
- **Gemini 1.5 Flash** — AI commit generation via `@google/generative-ai`
- **Rule-based fallback** — offline mode, no API key needed

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Gemini API key

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and paste your key:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com). Gemini 1.5 Flash is free up to 15 requests/min.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Home page
│   └── globals.css       # Animations, scrollbar, reset
├── components/
│   ├── layout/           # Nav, Footer
│   ├── sections/         # Hero, Playground, Features, Docs, GitHubSection
│   └── ui/               # TerminalWindow, TypeBadge, CopyButton, GrainOverlay
├── constants/            # Static data (flags, commits, terminal lines, colors)
├── lib/                  # generateCommit, gemini, ruleBased
└── styles/               # palette.ts color tokens
```

## Color Palette

| Token       | Value       | Usage                        |
|-------------|-------------|------------------------------|
| `cream`     | `#EFECE3`   | Page background              |
| `steel`     | `#4A70A9`   | Primary accent, CTAs         |
| `lightBlue` | `#8FABD4`   | Terminal text, sub-accents   |
| `ink`       | `#0D0D0D`   | Headlines, code backgrounds  |

## License

MIT — built by [nirvik34](https://github.com/nirvik34)
