import { describe, it, expect, vi } from "vitest";

import { explainCommit, ruleBasedExplanation } from "./explain";
import type { LLMProvider } from "./types";

function makeProvider(overrides: Partial<LLMProvider> = {}): LLMProvider {
  return {
    name: "openai",
    isAvailable: async () => true,
    resolveModel: async () => "gpt-4o-mini",
    enhanceCommit: async (msg) => msg,
    chat: async () => "  This is a reasoned answer.  ",
    ...overrides,
  } as LLMProvider;
}

const input = {
  message: "feat(api): add pagination",
  summary: "Added pagination to /users",
  type: "feat",
  scope: "api",
  model: "gpt-4o-mini",
};

describe("explainCommit", () => {
  it("returns the chat response trimmed when the provider is available", async () => {
    const provider = makeProvider();
    const result = await explainCommit(provider, input);
    expect(result).toBe("This is a reasoned answer.");
  });

  it("uses the rule-based explanation when the provider is unavailable", async () => {
    const provider = makeProvider({ isAvailable: async () => false });
    const result = await explainCommit(provider, input);
    expect(result).toBe(ruleBasedExplanation(input));
  });

  it("falls back when chat returns null", async () => {
    const provider = makeProvider({ chat: async () => null });
    const result = await explainCommit(provider, input);
    expect(result).toBe(ruleBasedExplanation(input));
  });

  it("falls back when chat returns an empty string", async () => {
    const provider = makeProvider({ chat: async () => "   " });
    const result = await explainCommit(provider, input);
    expect(result).toBe(ruleBasedExplanation(input));
  });

  it("sends the explain system prompt and the input fields in the user prompt", async () => {
    const chat = vi.fn().mockResolvedValue("ok");
    const provider = makeProvider({ chat });
    await explainCommit(provider, input);

    const [systemPrompt, userPrompt] = chat.mock.calls[0];
    expect(systemPrompt).toContain("conventional commit");
    expect(userPrompt).toContain("feat(api): add pagination");
    expect(userPrompt).toContain("Detected type: feat");
    expect(userPrompt).toContain("Detected scope: api");
  });
});
