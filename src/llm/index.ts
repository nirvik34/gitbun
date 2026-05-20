import { createOllamaProvider } from "./providers/ollama";
import { createOpenAIProvider } from "./providers/openai";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGeminiProvider } from "./providers/gemini";
import {
  DEFAULT_BACKEND,
  type LLMProvider,
  type ProviderConfig,
  type ProviderEnv,
  type ProviderName,
} from "./types";

export function createProvider(
  config: ProviderConfig = {},
  env: ProviderEnv = process.env
): LLMProvider {
  const backend: ProviderName = config.backend ?? DEFAULT_BACKEND;

  switch (backend) {
    case "openai":
      return createOpenAIProvider(env);
    case "anthropic":
      return createAnthropicProvider(env);
    case "gemini":
      return createGeminiProvider(env);
    case "ollama":
      return createOllamaProvider(env);
    default: {
      const exhaustive: never = backend;
      throw new Error(`Unknown LLM backend: ${exhaustive as string}`);
    }
  }
}

export type { LLMProvider, ProviderConfig, ProviderEnv, ProviderName } from "./types";
