import type { LLMProvider } from "./types";

export interface ExplainInput {
  message: string;
  summary: string;
  type: string;
  scope: string;
  model: string;
}

const EXPLAIN_SYSTEM_PROMPT = `You are an experienced code reviewer.
Explain in 2 to 3 short sentences why a given conventional commit message is
appropriate for the described change. Focus on the chosen type and scope.
Plain prose only — do not repeat the commit message line.`;

function buildExplainUserPrompt(input: ExplainInput): string {
  return `Commit message: ${input.message}

Detected type: ${input.type}
Detected scope: ${input.scope}

Summary of changes:
${input.summary}`;
}

function ruleBasedExplanation(input: ExplainInput): string {
  return `Type \`${input.type}\` was chosen because the staged change matches that category, and \`${input.scope}\` is the directory carrying the bulk of the edits. The description summarizes the change in the imperative mood so the message reads as a unit of work.`;
}

export async function explainCommit(
  provider: LLMProvider,
  input: ExplainInput
): Promise<string> {
  const available = await provider.isAvailable();
  if (!available) return ruleBasedExplanation(input);

  const raw = await provider.chat(
    EXPLAIN_SYSTEM_PROMPT,
    buildExplainUserPrompt(input),
    input.model,
    { maxTokens: 300, temperature: 0.3 }
  );

  if (!raw || raw.trim().length === 0) return ruleBasedExplanation(input);
  return raw.trim();
}

export { ruleBasedExplanation, EXPLAIN_SYSTEM_PROMPT };
