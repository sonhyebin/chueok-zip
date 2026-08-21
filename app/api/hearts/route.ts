import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { MEMORIES } from "@/data/memories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_IDS = new Set(MEMORIES.map((m) => m.id));
const COMMENT_ID = /^\d{15}-[a-z0-9]{4,10}$/;

/** 댓글 하트 — 이벤트를 append-only 블롭으로 기록 (경합 없음) */
export async function POST(req: NextRequest) {
  let body: { card?: string; id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const card = (body.card ?? "").trim();
  const id = (body.id ?? "").trim();
  if (!VALID_IDS.has(card) || !COMMENT_ID.test(id)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const key = `hearts/${card}/${id}/${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  await put(key, "1", { access: "public", addRandomSuffix: false });
  return NextResponse.json({ ok: true });
}
