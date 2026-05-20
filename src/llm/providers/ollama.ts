import fetch from "node-fetch";

import {
  COMMIT_SYSTEM_PROMPT,
  buildUserPrompt,
  cleanCommitOutput,
  type LLMProvider,
  type ProviderEnv,
} from "../types";

const OLLAMA_TIMEOUT_MS = 10000;
const DEFAULT_OLLAMA_HOST = "http://localhost:11434";

const PREFERRED_MODELS = [
  "deepseek-coder:6.7b",
  "deepseek-coder:base",
  "deepseek-coder",
  "codellama",
  "qwen2.5-coder",
  "llama3",
  "mistral",
];

const FALLBACK_MODEL = "deepseek-coder:6.7b";

type OllamaChatResponse = {
  message?: { content: string };
  error?: string;
};

type OllamaTagsResponse = {
  models: { name: string }[];
};

function getOllamaUrl(env: ProviderEnv): string {
  return env.OLLAMA_HOST?.replace(/\/$/, "") || DEFAULT_OLLAMA_HOST;
}

async function withTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function isOllamaRunning(env: ProviderEnv = process.env): Promise<boolean> {
  try {
    return await withTimeout(async (signal) => {
      const res = await fetch(getOllamaUrl(env), { signal });
      return res.ok;
    }, OLLAMA_TIMEOUT_MS);
  } catch {
    return false;
  }
}

export async function getAvailableModels(env: ProviderEnv = process.env): Promise<string[]> {
  try {
    return await withTimeout(async (signal) => {
      const res = await fetch(`${getOllamaUrl(env)}/api/tags`, { signal });
      if (!res.ok) return [];
      const data = (await res.json()) as OllamaTagsResponse;
      return data.models.map((m) => m.name);
    }, OLLAMA_TIMEOUT_MS);
  } catch {
    return [];
  }
}

export async function getBestModel(env: ProviderEnv = process.env): Promise<string | null> {
  const models = await getAvailableModels(env);
  if (models.length === 0) return null;

  for (const preferred of PREFERRED_MODELS) {
    const match = models.find((m) => m.startsWith(preferred));
    if (match) return match;
  }

  return models[0];
}

export async function enhanceCommitOllama(
  originalMessage: string,
  summary: string,
  model: string,
  env: ProviderEnv = process.env
): Promise<string> {
  try {
    return await withTimeout(async (signal) => {
      const response = await fetch(`${getOllamaUrl(env)}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: COMMIT_SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(originalMessage, summary) },
          ],
          stream: false,
        }),
        signal,
      });

      const data = (await response.json()) as OllamaChatResponse;

      if (data.error) {
        console.log(`\nOllama error: ${data.error}`);
        return originalMessage;
      }

      if (!data.message?.content) {
        return originalMessage;
      }

      return cleanCommitOutput(data.message.content);
    }, OLLAMA_TIMEOUT_MS);
  } catch (error) {
    console.log("\nAI Enhancement Failed:", error);
    return originalMessage;
  }
}

export function createOllamaProvider(env: ProviderEnv = process.env): LLMProvider {
  return {
    name: "ollama",
    isAvailable: () => isOllamaRunning(env),
    async resolveModel(requested?: string): Promise<string | null> {
      if (requested) return requested;
      const best = await getBestModel(env);
      return best ?? FALLBACK_MODEL;
    },
    enhanceCommit: (original, summary, model) =>
      enhanceCommitOllama(original, summary, model, env),
  };
}
