# Architecture & Contributing

## Project Structure

- `bin/`: CLI entry points.
- `src/analyzer/`: Core logic for detecting types, scopes, and generating summaries from git diffs.
- `src/config/`: Configuration loading via Cosmiconfig.
- `src/generator/`: The rule-based message generator (fallback engine).
- `src/git/`: Git utility functions (isGitRepo, getDiff, etc.).
- `src/llm/`: AI enhancement logic (Ollama client).
- `src/ui/`: Interactive CLI interface (Inquirer).

## How it works

1. **Scan**: Gitbun uses `simple-git` to find staged files.
2. **Analyze**:
   - `typeClassifier`: Maps file extensions and paths to conventional types.
   - `scopeDetector`: Finds the most common folder path among changes.
   - `summarizer`: Creates a raw text summary of added/deleted lines.
3. **Generate**:
   - Creates a base message using the rule-based engine.
   - If AI is enabled and Ollama is running, sends the base message + summary to the LLM for refinement.
4. **Interact**:
   - Prompts the user to confirm or edit the message.
5. **Commit**:
   - Executes `git commit -m "[message]"`.

## Contributing

1. **Branching**: Use `feat/`, `fix/`, or `refactor/` prefixes.
2. **Tests**: Add tests in `.test.ts` files. Run via `npm test`.
3. **Linting**: Run `npm run lint` before pushing.
4. **Conventional Commits**: This project uses Semantic Release. Your commits must follow [Conventional Commits](https://www.conventionalcommits.org/).
