export interface SharePayload {
  message: string;
  diff: string;
  reasoning: string;
  type: string;
  scope: string;
  provider: string;
  model: string;
  createdAt: string;
}

export const MAX_PAYLOAD_BYTES = 256 * 1024;
export const SHARE_TTL_MS = 24 * 60 * 60 * 1000;
