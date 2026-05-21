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

const GEMINI_TIMEOUT_MS = 20000;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-1.5-flash";

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
};

async function callGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  options: ChatOptions
): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const url = `${GEMINI_BASE_URL}/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: options.temperature ?? 0.2,
          ...(options.maxTokens !== undefined
            ? { maxOutputTokens: options.maxTokens }
            : {}),
        },
      }),
      signal: controller.signal,
    });

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok || data.error) {
      console.log(
        `\nGemini error: ${data.error?.message ?? `HTTP ${response.status}`}`
      );
      return null;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.log("\nGemini call failed:", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createGeminiProvider(env: ProviderEnv = process.env): LLMProvider {
  const apiKey = resolveApiKey("gemini", env);

  return {
    name: "gemini",

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
          "\nGemini: missing API key. Set LLM_API_KEY or GEMINI_API_KEY to enable."
        );
        return originalMessage;
      }

      const raw = await callGemini(
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
      const raw = await callGemini(apiKey, model, systemPrompt, userPrompt, options);
      return raw ? raw.trim() : null;
    },
  };
}
