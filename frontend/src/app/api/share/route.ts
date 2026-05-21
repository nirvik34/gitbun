import { NextResponse } from "next/server";

import { setShare } from "@/lib/shareStore";
import { MAX_PAYLOAD_BYTES, type SharePayload } from "@/lib/shareTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function validatePayload(value: unknown): SharePayload | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const required = [
    "message",
    "diff",
    "reasoning",
    "type",
    "scope",
    "provider",
    "model",
    "createdAt",
  ] as const;
  for (const k of required) {
    if (!isString(obj[k])) return null;
  }
  return {
    message: obj.message as string,
    diff: obj.diff as string,
    reasoning: obj.reasoning as string,
    type: obj.type as string,
    scope: obj.scope as string,
    provider: obj.provider as string,
    model: obj.model as string,
    createdAt: obj.createdAt as string,
  };
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: `Payload exceeds ${MAX_PAYLOAD_BYTES} bytes.` },
      { status: 413 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = validatePayload(parsed);
  if (!payload) {
    return NextResponse.json(
      { error: "Missing or invalid required fields." },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  setShare(id, payload);

  const origin = new URL(request.url).origin;
  return NextResponse.json({ id, url: `${origin}/share/${id}` }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
