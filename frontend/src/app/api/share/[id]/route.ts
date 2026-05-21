import { NextResponse } from "next/server";

import { getExpiry, getShare } from "@/lib/shareStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = getShare(id);
  if (!payload) {
    return NextResponse.json(
      { error: "Share not found or expired." },
      { status: 404 }
    );
  }

  const expiresAt = getExpiry(id);
  return NextResponse.json({ payload, expiresAt });
}
