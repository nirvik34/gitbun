import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();

vi.mock("node-fetch", () => ({
  default: (...args: unknown[]) => fetchMock(...args),
}));

import { createShare, ShareError } from "./shareClient";
import type { SharePayload } from "./types";

function payload(overrides: Partial<SharePayload> = {}): SharePayload {
  return {
    message: "feat(api): add pagination",
    diff: "diff --git a/x b/x\n",
    reasoning: "because",
    type: "feat",
    scope: "api",
    provider: "openai",
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

describe("createShare", () => {
  beforeEach(() => fetchMock.mockReset());

  it("POSTs to {base}/api/share and returns the parsed response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ id: "abc", url: "http://x/share/abc" }, true, 201)
    );
    const result = await createShare(payload(), "http://localhost:3000");
    expect(result).toEqual({ id: "abc", url: "http://x/share/abc" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:3000/api/share");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string).message).toBe("feat(api): add pagination");
  });

  it("trims a trailing slash on the base URL", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ id: "abc", url: "http://x/share/abc" })
    );
    await createShare(payload(), "http://localhost:3000/");
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:3000/api/share");
  });

  it("rejects payloads larger than the size cap", async () => {
    const big = payload({ diff: "x".repeat(300 * 1024) });
    await expect(createShare(big, "http://localhost:3000")).rejects.toBeInstanceOf(
      ShareError
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wraps HTTP errors in a ShareError", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "bad" }, false, 500));
    await expect(createShare(payload(), "http://localhost:3000")).rejects.toMatchObject({
      name: "ShareError",
    });
  });

  it("rejects an unexpected response shape", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ foo: "bar" }));
    await expect(createShare(payload(), "http://localhost:3000")).rejects.toBeInstanceOf(
      ShareError
    );
  });
});
