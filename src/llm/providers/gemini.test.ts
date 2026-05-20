import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();

vi.mock("node-fetch", () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}));

import { createGeminiProvider } from "./gemini";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

describe("Gemini provider", () => {
  beforeEach(() => fetchMock.mockReset());

  it("reports unavailable without an API key", async () => {
    const provider = createGeminiProvider({});
    expect(await provider.isAvailable()).toBe(false);
  });

  it("encodes the model and API key into the URL", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        candidates: [
          { content: { parts: [{ text: "feat(api): add pagination" }] } },
        ],
      })
    );
    const provider = createGeminiProvider({ GEMINI_API_KEY: "k+1" });
    await provider.enhanceCommit("feat: x", "ctx", "gemini-1.5-flash");
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=k%2B1"
    );
  });

  it("uses gemini-1.5-flash as the default model", async () => {
    const provider = createGeminiProvider({ GEMINI_API_KEY: "k" });
    expect(await provider.resolveModel()).toBe("gemini-1.5-flash");
  });

  it("falls back on HTTP error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { message: "bad key" } }, false, 403)
    );
    const provider = createGeminiProvider({ GEMINI_API_KEY: "k" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gemini-1.5-flash");
    expect(result).toBe("feat: x");
  });

  it("falls back on missing candidates", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ candidates: [] }));
    const provider = createGeminiProvider({ GEMINI_API_KEY: "k" });
    const result = await provider.enhanceCommit("feat: x", "ctx", "gemini-1.5-flash");
    expect(result).toBe("feat: x");
  });
});
