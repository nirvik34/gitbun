# Gitbun

[![npm version](https://img.shields.io/npm/v/gitbun.svg?style=flat-square)](https://www.npmjs.com/package/gitbun)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nirvik34/gitbun/release.yml?branch=main&style=flat-square)](https://github.com/nirvik34/gitbun/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

**Gitbun** is a high-performance, intelligent CLI assistant designed to automate your Git workflow. It analyzes your staged changes and generates clean, professional, and context-aware [Conventional Commits](https://www.conventionalcommits.org/) in milliseconds.

No more `feat: update code` or `fix: fix bug`. Gitbun understands your diffs.

---

## Features

- **AI-Powered**: Leverages local LLMs (via Ollama) or remote APIs to write human-like commit descriptions.
- **Conventional Commits**: Automatically detects the correct `type` (feat, fix, refactor, etc.) and `scope` based on your file structure.
- **Smart Fallback**: If the AI is offline, Gitbun uses a robust rule-based engine to generate structured messages.
- **Interactive Mode**: Review, edit, or regenerate suggestions before committing.
- **Highly Configurable**: Works out-of-the-box, but stays customizable via `.smartcommitrc` or `package.json`.
- **Privacy First**: With local AI support, your code analysis never leaves your machine.

---

## Quick Start

Generate a perfect commit message for your staged changes:

```sh
# Stage your changes first
git add .

# Run Gitbun
npx gitbun
```

---

## Installation

Install globally for the best experience:

```sh
npm install -g gitbun
```

Then simply type `gitbun` in any repository.

---

## Usage & Flags

| Flag | Shortcut | Description |
|---|---|---|
| `--ai` | - | Use AI enhancement (default: `true`) |
| `--no-ai` | - | Disable AI, use rule-based fallback |
| `--model <name>` | - | Specify a specific LLM model (e.g. `llama3`) |
| `--interactive` | `-i` | Force interactive preview (default: `true`) |
| `--auto` | - | Commit immediately without preview (DANGEROUS) |
| `--config <path>` | - | Path to a custom config file |
| `--help` | - | Show usage info |

---

## Local AI Setup (Ollama)

To get the most out of Gitbun without sending data to the cloud, use it with [Ollama](https://ollama.ai/):

1. **Install Ollama** from [ollama.com](https://ollama.com).
2. **Download a model** (we recommend `deepseek-coder` or `llama3`):
   ```sh
   ollama pull deepseek-coder:6.7b
   ```
3. **Run Gitbun**: Gitbun will automatically detect Ollama and use your downloaded models.

---

## Configuration

Gitbun uses [Cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to find settings. You can add a `smartcommit` block to your `package.json` or create a `.smartcommitrc` file.

**Example `.smartcommitrc`:**
```json
{
  "model": "deepseek-coder:6.7b",
  "ai": true,
  "interactive": true
}
```

---

## Fallback & Rule-Based Logic

When AI is unavailable, Gitbun falls back to a deterministic summarization engine. 

### How it works:
1. **Type Detection**: Analyzes filenames and extensions (e.g., `.test.ts` → `test`, `docs/` → `docs`).
2. **Scope Detection**: Identifies the primary module or package directory affected.
3. **Verb Selection**: Map types to imperative verbs (`feat` → `add`, `fix` → `resolve`).
4. **Noun Extraction**: Pulls logical nouns from your folder structure.

**Example Fallback Output:**
`feat(analyzer): add scopeDetector`

---

## Examples & Screenshots

### AI Enhancement Mode
**Staged Diff:**
```diff
- export function run() {
+ export async function run(options: CliOptions) {
```
**Gitbun Output:**
`feat(core): implement support for CLI options and async execution`

### Multi-file refactor
**Staged:** `src/analyzer/typeClassifier.ts`, `src/analyzer/summarizer.ts`
**Gitbun Output:**
`refactor(analyzer): optimize classification and summarization logic`

---

## CI/CD Integration

Gitbun can be used in CI/CD pipelines using the `--auto` flag.

**GitHub Actions Example:**
```yaml
jobs:
  auto-fix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run gitbun
        run: npx gitbun --auto
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Contributing

We welcome contributions! See the [docs/](docs/) for more details on project architecture.

## License

MIT © [Nirvik Goswami](https://github.com/nirvik34)
