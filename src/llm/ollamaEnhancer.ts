import { enhanceCommitOllama } from "./providers/ollama";

export async function enhanceCommit(
  originalMessage: string,
  summary: string,
  model: string
): Promise<string> {
  return enhanceCommitOllama(originalMessage, summary, model);
}
