import { describe, it, expect } from "vitest";

import { createProvider } from "./index";

describe("createProvider", () => {
  it("defaults to the Ollama backend when no config is provided", () => {
    const provider = createProvider({}, {});
    expect(provider.name).toBe("ollama");
  });

  it("returns the OpenAI provider when backend=openai", () => {
    const provider = createProvider({ backend: "openai" }, { LLM_API_KEY: "x" });
    expect(provider.name).toBe("openai");
  });

  it("returns the Anthropic provider when backend=anthropic", () => {
    const provider = createProvider(
      { backend: "anthropic" },
      { ANTHROPIC_API_KEY: "x" }
    );
    expect(provider.name).toBe("anthropic");
  });

  it("returns the Gemini provider when backend=gemini", () => {
    const provider = createProvider({ backend: "gemini" }, { GEMINI_API_KEY: "x" });
    expect(provider.name).toBe("gemini");
  });

  it("reports unavailable for cloud backends without an API key", async () => {
    const provider = createProvider({ backend: "openai" }, {});
    expect(await provider.isAvailable()).toBe(false);
  });

  it("falls back to the original message when invoked without an API key", async () => {
    const provider = createProvider({ backend: "anthropic" }, {});
    const result = await provider.enhanceCommit(
      "feat: x",
      "ctx",
      "claude-haiku-4-5-20251001"
    );
    expect(result).toBe("feat: x");
  });
});
