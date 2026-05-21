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

export interface CreateShareResponse {
  id: string;
  url: string;
}

export const MAX_PAYLOAD_BYTES = 256 * 1024;
