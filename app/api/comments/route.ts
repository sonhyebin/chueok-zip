import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { MEMORIES } from "@/data/memories";
import { REGIONS } from "@/lib/regions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_IDS = new Set(MEMORIES.map((m) => m.id));
const MAX_LIST = 100;

const REGION_SET = new Set<string>(REGIONS);

type Comment = {
  name: string;
  text: string;
  ts: number;
  region?: string;
  /** 블롭 파일명 기반 id (하트 집계 키) */
  id?: string;
  hearts?: number;
};

function prefix(card: string) {
  return `comments/${card}/`;
}

export async function GET(req: NextRequest) {
  const card = req.nextUrl.searchParams.get("card") ?? "";
  if (!VALID_IDS.has(card)) {
    return NextResponse.json({ error: "unknown card" }, { status: 400 });
  }
  const [{ blobs }, heartsList] = await Promise.all([
    list({ prefix: prefix(card), limit: 1000 }),
    list({ prefix: `hearts/${card}/`, limit: 1000 }),
  ]);
  // 하트 집계: hearts/<card>/<commentId>/<rand>
  const heartCount = new Map<string, number>();
  for (const h of heartsList.blobs) {
    const cid = h.pathname.split("/")[2];
    if (cid) heartCount.set(cid, (heartCount.get(cid) ?? 0) + 1);
  }
  // 파일명이 <ts>-<rand>.json 이므로 최신순 정렬
  blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const slice = blobs.slice(0, MAX_LIST);
  const comments: Comment[] = (
    await Promise.all(
      slice.map(async (b) => {
        try {
          const r = await fetch(b.url, { cache: "force-cache" });
          const c = (await r.json()) as Comment;
          const id = b.pathname.split("/").pop()!.replace(".json", "");
          c.id = id;
          c.hearts = heartCount.get(id) ?? 0;
          return c;
        } catch {
          return null;
        }
      }),
    )
  ).filter((c): c is Comment => Boolean(c && c.name && c.text));
  // 하트 많은 순 → 같으면 최신순
  comments.sort((a, b) => (b.hearts! - a.hearts!) || (b.ts - a.ts));
  return NextResponse.json(
    { count: blobs.length, comments },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  let body: {
    card?: string;
    name?: string;
    text?: string;
    region?: string;
    website?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const card = (body.card ?? "").trim();
  const name = (body.name ?? "").trim().slice(0, 12);
  const text = (body.text ?? "").trim().slice(0, 200);
  // 허니팟 — 봇이 채우는 숨은 필드
  if (body.website) {
    return NextResponse.json({ ok: true });
  }
  if (!VALID_IDS.has(card) || name.length < 1 || text.length < 1) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const region = REGION_SET.has((body.region ?? "").trim())
    ? (body.region ?? "").trim()
    : undefined;
  const ts = Date.now();
  const cid = `${String(ts).padStart(15, "0")}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const comment: Comment = {
    name,
    text,
    ts,
    ...(region ? { region } : {}),
    id: cid,
    hearts: 0,
  };
  const key = `${prefix(card)}${cid}.json`;
  await put(key, JSON.stringify(comment), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return NextResponse.json({ ok: true, comment });
}
