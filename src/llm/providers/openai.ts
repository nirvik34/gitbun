import fetch from "node-fetch";

import {
  COMMIT_SYSTEM_PROMPT,
  buildUserPrompt,
  cleanCommitOutput,
  resolveApiKey,
  type ChatOptions,
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

async function callOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  options: ChatOptions
): Promise<string | null> {
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: options.temperature ?? 0.2,
        ...(options.maxTokens !== undefined ? { max_tokens: options.maxTokens } : {}),
      }),
      signal: controller.signal,
    });

    const data = (await response.json()) as OpenAIResponse;

    if (!response.ok || data.error) {
      console.log(
        `\nOpenAI error: ${data.error?.message ?? `HTTP ${response.status}`}`
      );
      return null;
    }

    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.log("\nOpenAI call failed:", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

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

      const raw = await callOpenAI(
        apiKey,
        model,
        COMMIT_SYSTEM_PROMPT,
        buildUserPrompt(originalMessage, summary),
        {}
      );

      return raw ? cleanCommitOutput(raw) : originalMessage;
    },

    async chat(
      systemPrompt: string,
      userPrompt: string,
      model: string,
      options: ChatOptions = {}
    ): Promise<string | null> {
      if (!apiKey) return null;
      const raw = await callOpenAI(apiKey, model, systemPrompt, userPrompt, options);
      return raw ? raw.trim() : null;
    },
  };
}
