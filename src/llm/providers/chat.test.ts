import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();

vi.mock("node-fetch", () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}));

import { createOpenAIProvider } from "./openai";
import { createAnthropicProvider } from "./anthropic";
import { createGeminiProvider } from "./gemini";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

describe("provider.chat()", () => {
  beforeEach(() => fetchMock.mockReset());

  it("returns null without an API key (openai)", async () => {
    const provider = createOpenAIProvider({});
    const result = await provider.chat("sys", "user", "gpt-4o-mini");
    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards the system + user prompts to OpenAI", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: "an answer" } }] })
    );
    const provider = createOpenAIProvider({ LLM_API_KEY: "k" });
    const result = await provider.chat("sys-prompt", "user-prompt", "gpt-4o-mini", {
      maxTokens: 50,
    });
    expect(result).toBe("an answer");
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0]).toEqual({ role: "system", content: "sys-prompt" });
    expect(body.messages[1]).toEqual({ role: "user", content: "user-prompt" });
    expect(body.max_tokens).toBe(50);
  });

  it("forwards prompts to Anthropic with system + messages shape", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ content: [{ type: "text", text: "an answer" }] })
    );
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "k" });
    const result = await provider.chat("sys", "user", "claude-haiku-4-5-20251001", {
      maxTokens: 80,
    });
    expect(result).toBe("an answer");
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.system).toBe("sys");
    expect(body.messages[0]).toEqual({ role: "user", content: "user" });
    expect(body.max_tokens).toBe(80);
  });

  it("forwards prompts to Gemini with systemInstruction + contents shape", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        candidates: [{ content: { parts: [{ text: "an answer" }] } }],
      })
    );
    const provider = createGeminiProvider({ GEMINI_API_KEY: "k" });
    const result = await provider.chat("sys", "user", "gemini-1.5-flash", {
      maxTokens: 40,
    });
    expect(result).toBe("an answer");
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body.systemInstruction.parts[0].text).toBe("sys");
    expect(body.contents[0].parts[0].text).toBe("user");
    expect(body.generationConfig.maxOutputTokens).toBe(40);
  });

  it("returns null on HTTP error", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: { message: "boom" } }, false, 500));
    const provider = createOpenAIProvider({ LLM_API_KEY: "k" });
    const result = await provider.chat("sys", "user", "gpt-4o-mini");
    expect(result).toBeNull();
  });
});
