import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();

vi.mock("node-fetch", () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}));

import { createAnthropicProvider } from "./anthropic";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

describe("Anthropic provider", () => {
  beforeEach(() => fetchMock.mockReset());

  it("reports unavailable without an API key", async () => {
    const provider = createAnthropicProvider({});
    expect(await provider.isAvailable()).toBe(false);
  });

  it("sends x-api-key and anthropic-version headers", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ content: [{ type: "text", text: "feat: x" }] })
    );
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "sk-ant" });
    await provider.enhanceCommit("feat: x", "ctx", "claude-haiku-4-5-20251001");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    const headers = init.headers as Record<string, string>;
    expect(headers["x-api-key"]).toBe("sk-ant");
    expect(headers["anthropic-version"]).toBe("2023-06-01");
  });

  it("uses claude-haiku as the default model", async () => {
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "sk-ant" });
    expect(await provider.resolveModel()).toBe("claude-haiku-4-5-20251001");
  });

  it("extracts the text block from a multi-block response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        content: [
          { type: "tool_use" },
          { type: "text", text: "feat(api): add pagination" },
        ],
      })
    );
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "sk-ant" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "claude-haiku-4-5-20251001");
    expect(result).toBe("feat(api): add pagination");
  });

  it("falls back on HTTP error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { message: "rate limited" } }, false, 429)
    );
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "sk-ant" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "claude-haiku-4-5-20251001");
    expect(result).toBe("feat: x");
  });

  it("falls back on missing content", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ content: [] }));
    const provider = createAnthropicProvider({ ANTHROPIC_API_KEY: "sk-ant" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "claude-haiku-4-5-20251001");
    expect(result).toBe("feat: x");
  });
});
