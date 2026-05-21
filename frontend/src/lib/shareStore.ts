import { SHARE_TTL_MS, type SharePayload } from "./shareTypes";

/**
 * v1 in-memory share store. Backed by a `Map<id, { payload, expiresAt }>`
 * with a 24-hour TTL. Single-instance only — replace with a KV/Redis-backed
 * adapter if Gitbun is deployed across multiple Node workers.
 *
 * Pinned on `globalThis` so Next.js hot reloads in dev preserve the store.
 */

interface Entry {
  payload: SharePayload;
  expiresAt: number;
}

type StoreShape = Map<string, Entry>;

const STORE_KEY = "__gitbunShareStore" as const;

interface GlobalWithStore {
  [STORE_KEY]?: StoreShape;
}

function getStore(): StoreShape {
  const g = globalThis as GlobalWithStore;
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = new Map<string, Entry>();
  }
  return g[STORE_KEY];
}

function sweep(store: StoreShape, now: number): void {
  for (const [id, entry] of store) {
    if (entry.expiresAt <= now) {
      store.delete(id);
    }
  }
}

export function setShare(
  id: string,
  payload: SharePayload,
  ttlMs: number = SHARE_TTL_MS
): void {
  const store = getStore();
  const now = Date.now();
  sweep(store, now);
  store.set(id, { payload, expiresAt: now + ttlMs });
}

export function getShare(id: string): SharePayload | null {
  const store = getStore();
  const entry = store.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(id);
    return null;
  }
  return entry.payload;
}

export function getExpiry(id: string): number | null {
  const store = getStore();
  const entry = store.get(id);
  if (!entry || entry.expiresAt <= Date.now()) return null;
  return entry.expiresAt;
}
