import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { put } from "@vercel/blob";
import { isCapsuleRecord, type CapsuleRecord } from "@/lib/capsule";
import {
  CAPSULE_ID,
  capsuleResultPath,
  getCapsuleRecord,
} from "@/lib/capsuleStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!CAPSULE_ID.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  const record = await getCapsuleRecord(id);
  if (!record) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(record, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!CAPSULE_ID.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  let body: { record?: unknown; updateProof?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!isCapsuleRecord(body.record) || body.record.kind !== "result") {
    return NextResponse.json({ error: "invalid capsule" }, { status: 400 });
  }
  const updateProof =
    typeof body.updateProof === "string" ? body.updateProof : "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(updateProof)) {
    return NextResponse.json({ error: "invalid proof" }, { status: 403 });
  }

  const currentValue = await getCapsuleRecord(id);
  if (!currentValue) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (currentValue.kind !== "invite") {
    return NextResponse.json({ error: "already completed" }, { status: 409 });
  }

  const next = body.record as CapsuleRecord;
  const actualProofHash = createHash("sha256")
    .update(updateProof)
    .digest("base64url");
  if (
    !timingSafeEqual(
      Buffer.from(actualProofHash),
      Buffer.from(currentValue.updateProofHash),
    )
  ) {
    return NextResponse.json({ error: "invalid proof" }, { status: 403 });
  }
  if (
    next.year !== currentValue.year ||
    next.aName !== currentValue.fromName ||
    next.updateProofHash !== currentValue.updateProofHash ||
    next.createdAt !== currentValue.createdAt
  ) {
    return NextResponse.json({ error: "capsule mismatch" }, { status: 400 });
  }

  try {
    await put(capsuleResultPath(id), JSON.stringify(next), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } catch {
    return NextResponse.json({ error: "already completed" }, { status: 409 });
  }

  return NextResponse.json({ id });
}
