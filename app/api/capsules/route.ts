import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { AVAILABLE_YEARS } from "@/data/memories";
import { isCapsuleRecord, type CapsuleRecord } from "@/lib/capsule";
import { capsulePath } from "@/lib/capsuleStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let value: unknown;
  try {
    value = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (
    !isCapsuleRecord(value) ||
    value.kind !== "invite" ||
    !AVAILABLE_YEARS.includes(value.year)
  ) {
    return NextResponse.json({ error: "invalid capsule" }, { status: 400 });
  }

  const id = randomBytes(9).toString("base64url");
  const record: CapsuleRecord = { ...value, createdAt: Date.now() };
  await put(capsulePath(id), JSON.stringify(record), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json({ id });
}
