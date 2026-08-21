import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 간이 동시접속 카운터.
 * 클라이언트가 30초마다 세션 id로 하트비트를 보내고,
 * 최근 90초 내 하트비트가 있는 세션 수를 "지금 접속 중"으로 계산한다.
 * 인스턴스 메모리 기반(Fluid Compute에서 인스턴스가 재사용됨) — MVP 근사치.
 */
const seen = new Map<string, number>();
const WINDOW_MS = 90_000;

function countActive(): number {
  const now = Date.now();
  let n = 0;
  for (const [id, ts] of seen) {
    if (now - ts > WINDOW_MS) seen.delete(id);
    else n++;
  }
  return n;
}

export async function POST(req: NextRequest) {
  let body: { sid?: string } = {};
  try {
    body = await req.json();
  } catch {}
  const sid = (body.sid ?? "").slice(0, 40);
  if (sid) seen.set(sid, Date.now());
  return NextResponse.json(
    { online: countActive() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  return NextResponse.json(
    { online: countActive() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
