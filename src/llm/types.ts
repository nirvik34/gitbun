export type ProviderName = "ollama" | "openai" | "anthropic" | "gemini";

export interface LLMProvider {
  readonly name: ProviderName;

  isAvailable(): Promise<boolean>;

  resolveModel(requested?: string): Promise<string | null>;

  enhanceCommit(
    originalMessage: string,
    summary: string,
    model: string
  ): Promise<string>;
}

export interface ProviderConfig {
  backend?: ProviderName;
  model?: string;
}

export type ProviderEnv = Readonly<Record<string, string | undefined>>;

export const DEFAULT_BACKEND: ProviderName = "ollama";

export const PROVIDER_KEY_ENV: Record<Exclude<ProviderName, "ollama">, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  gemini: "GEMINI_API_KEY",
};

export function resolveApiKey(
  provider: Exclude<ProviderName, "ollama">,
  env: ProviderEnv
): string | undefined {
  const generic = env.LLM_API_KEY?.trim();
  if (generic) return generic;
  const specific = env[PROVIDER_KEY_ENV[provider]]?.trim();
  return specific && specific.length > 0 ? specific : undefined;
}

export const COMMIT_SYSTEM_PROMPT = `You are a senior developer who writes perfect conventional commits.
Your task is to refine the description of a commit message while keeping its type and scope.
Follow these rules strictly:
1. Return ONLY the commit message line. No explanations.
2. Use the format: <type>(<scope>): <description>
3. The description must be in the IMPERATIVE mood (e.g., "add" instead of "added").
4. Description must start with a lowercase letter.
5. Do NOT include a trailing period.
6. Max length 72 characters.
7. If the original message is already excellent, return it as is.`;

export function buildUserPrompt(originalMessage: string, summary: string): string {
  return `Refine this commit message:
Original: ${originalMessage}

Context of changes:
${summary}`;
}

export function cleanCommitOutput(raw: string): string {
  let result = raw.trim();
  result = result.replace(/^[`"']|[`"']$/g, "");
  result = result.replace(/^commit:\s*/i, "");
  result = result.split("\n")[0];
  return result;
}
