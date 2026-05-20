import fetch from "node-fetch";

import {
  COMMIT_SYSTEM_PROMPT,
  buildUserPrompt,
  cleanCommitOutput,
  resolveApiKey,
  type LLMProvider,
  type ProviderEnv,
} from "../types";

const OPENAI_TIMEOUT_MS = 20000;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

type OpenAIResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

export function createOpenAIProvider(env: ProviderEnv = process.env): LLMProvider {
  const apiKey = resolveApiKey("openai", env);

  return {
    name: "openai",

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
          "\nOpenAI: missing API key. Set LLM_API_KEY or OPENAI_API_KEY to enable."
        );
        return originalMessage;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

      try {
        const response = await fetch(OPENAI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: COMMIT_SYSTEM_PROMPT },
              { role: "user", content: buildUserPrompt(originalMessage, summary) },
            ],
            temperature: 0.2,
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as OpenAIResponse;

        if (!response.ok || data.error) {
          console.log(
            `\nOpenAI error: ${data.error?.message ?? `HTTP ${response.status}`}`
          );
          return originalMessage;
        }

        const content = data.choices?.[0]?.message?.content;
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
