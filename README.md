# Gitbun

Gitbun is an intelligent CLI tool that generates meaningful, context-aware Git commit messages for your staged changes. It leverages AI to analyze your codebase and commit diffs, helping you write better commit messages faster.

## Why Gitbun?

Writing clear, descriptive commit messages is essential for collaboration and project history. SmartCommit automates this process, saving time and ensuring consistency, especially for teams and open-source contributors.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/nirvik34/gitbun.git
   cd gitbun
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. (Optional) Link globally for CLI usage:
   ```sh
   npm link
   ```

## Usage

To generate a commit message for your staged changes, run:

```sh
smartcommit
```

You can also use it directly with npx:

```sh
npx smartcommit
```

### Flags

- `--ai`         Use AI-powered commit message generation (default: enabled)
- `--no-ai`      Disable AI mode, use rule-based summarization
- `--interactive`  Launch interactive mode for message editing
- `--config <path>`  Specify a custom config file
- `--help`       Show help and usage information

## AI Mode Explanation

When AI mode is enabled, SmartCommit uses a local or remote LLM (Large Language Model) to:
- Analyze your staged diffs
- Detect the scope and type of changes
- Summarize intent and impact
- Generate a clear, conventional commit message

If AI mode is disabled, SmartCommit falls back to a rule-based summarizer for basic commit messages.

## Requirements

- Node.js v18 or higher
- Git installed and available in your PATH
- (Optional for AI mode) Local LLM server (e.g., Ollama) or API access

## Example Output

```
$ 
[AI] feat(analyzer): add type classification for improved commit context

- Implemented typeClassifier to detect code change types
- Enhanced commit message quality with better context
```

---

For more details, see the [docs/](docs/) directory or run `gitbun --help`.
