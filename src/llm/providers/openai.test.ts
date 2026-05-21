import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fetchMock = vi.fn();

vi.mock("node-fetch", () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}));

import { createOpenAIProvider } from "./openai";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  };
}

describe("OpenAI provider", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports unavailable when no API key is present", async () => {
    const provider = createOpenAIProvider({});
    expect(await provider.isAvailable()).toBe(false);
  });

  it("reports available when LLM_API_KEY is set", async () => {
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    expect(await provider.isAvailable()).toBe(true);
  });

  it("prefers LLM_API_KEY over OPENAI_API_KEY", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: "feat(x): y" } }] })
    );
    const provider = createOpenAIProvider({
      LLM_API_KEY: "sk-generic",
      OPENAI_API_KEY: "sk-specific",
    });
    await provider.enhanceCommit("feat: x", "summary", "gpt-4o-mini");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer sk-generic"
    );
  });

  it("defaults to gpt-4o-mini when no model is requested", async () => {
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    expect(await provider.resolveModel()).toBe("gpt-4o-mini");
    expect(await provider.resolveModel("gpt-4o")).toBe("gpt-4o");
  });

  it("returns cleaned content on a successful response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        choices: [{ message: { content: '"feat(api): add pagination"' } }],
      })
    );
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gpt-4o-mini");
    expect(result).toBe("feat(api): add pagination");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("gpt-4o-mini");
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[1].role).toBe("user");
  });

  it("falls back to original message on HTTP error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { message: "bad key" } }, false, 401)
    );
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gpt-4o-mini");
    expect(result).toBe("feat: x");
  });

  it("falls back to original message on missing content", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ choices: [{ message: {} }] }));
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gpt-4o-mini");
    expect(result).toBe("feat: x");
  });

  it("falls back to original message on network failure", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const provider = createOpenAIProvider({ LLM_API_KEY: "sk-test" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gpt-4o-mini");
    expect(result).toBe("feat: x");
  });

  it("returns original message without calling fetch when key is missing", async () => {
    const provider = createOpenAIProvider({});
    const result = await provider.enhanceCommit("feat: x", "ctx", "gpt-4o-mini");
    expect(result).toBe("feat: x");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
