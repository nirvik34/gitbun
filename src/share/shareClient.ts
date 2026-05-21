import fetch from "node-fetch";

import {
  MAX_PAYLOAD_BYTES,
  type CreateShareResponse,
  type SharePayload,
} from "./types";

const SHARE_TIMEOUT_MS = 10000;

export class ShareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShareError";
  }
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function createShare(
  payload: SharePayload,
  baseUrl: string
): Promise<CreateShareResponse> {
  const body = JSON.stringify(payload);
  if (Buffer.byteLength(body, "utf8") > MAX_PAYLOAD_BYTES) {
    throw new ShareError(
      `Share payload exceeds ${MAX_PAYLOAD_BYTES} bytes; the diff is too large to share.`
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SHARE_TIMEOUT_MS);

  try {
    const response = await fetch(joinUrl(baseUrl, "/api/share"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new ShareError(
        `Share endpoint returned HTTP ${response.status}${text ? `: ${text}` : ""}`
      );
    }

    const data = (await response.json()) as Partial<CreateShareResponse>;
    if (!data.id || !data.url) {
      throw new ShareError("Share endpoint returned an unexpected response shape.");
    }

    return { id: data.id, url: data.url };
  } catch (error) {
    if (error instanceof ShareError) throw error;
    throw new ShareError(
      `Failed to reach share endpoint at ${baseUrl}: ${(error as Error).message}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
