import fetch from "node-fetch";

import {
  COMMIT_SYSTEM_PROMPT,
  buildUserPrompt,
  cleanCommitOutput,
  resolveApiKey,
  type LLMProvider,
  type ProviderEnv,
} from "../types";

const ANTHROPIC_TIMEOUT_MS = 20000;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  error?: { message?: string };
};

export function createAnthropicProvider(env: ProviderEnv = process.env): LLMProvider {
  const apiKey = resolveApiKey("anthropic", env);

  return {
    name: "anthropic",

    async isAvailable(): Promise<boolean> {
      return Boolean(apiKey);
    },

    async resolveModel(requested?: string): Promise<string | null> {
      return requested?.trim() || DEFAULT_MODEL;
    },

    async enhanceCommit(
      originalMessage: string,
      summary: string,
      model: string
    ): Promise<string> {
      if (!apiKey) {
        console.log(
          "\nAnthropic: missing API key. Set LLM_API_KEY or ANTHROPIC_API_KEY to enable."
        );
        return originalMessage;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);

      try {
        const response = await fetch(ANTHROPIC_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": ANTHROPIC_VERSION,
          },
          body: JSON.stringify({
            model,
            max_tokens: 256,
            system: COMMIT_SYSTEM_PROMPT,
            messages: [
              { role: "user", content: buildUserPrompt(originalMessage, summary) },
            ],
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as AnthropicResponse;

        if (!response.ok || data.error) {
          console.log(
            `\nAnthropic error: ${data.error?.message ?? `HTTP ${response.status}`}`
          );
          return originalMessage;
        }

        const textBlock = data.content?.find((b) => b.type === "text");
        const content = textBlock?.text;
        if (!content) return originalMessage;

        return cleanCommitOutput(content);
      } catch (error) {
        console.log("\nAI Enhancement Failed:", error);
        return originalMessage;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
