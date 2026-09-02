import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTS = new Set([
  "memory_share",
  "school_years_share",
  "story_image_share",
  "invite_created",
  "invite_share",
  "invite_open",
  "invite_completed",
  "result_share",
  "chain_start",
  "partner_cta_click",
]);

export async function POST(req: NextRequest) {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { event?: string; properties?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!body.event || !EVENTS.has(body.event)) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  const properties: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(body.properties ?? {}).slice(0, 8)) {
    if (!/^[a-z][a-z0-9_]{0,30}$/.test(key)) continue;
    if (typeof value === "number" && Number.isFinite(value)) properties[key] = value;
    if (typeof value === "string") properties[key] = value.slice(0, 80);
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await put(
    `events/${date}/${body.event}/${suffix}.json`,
    JSON.stringify({ event: body.event, properties, ts: now.getTime() }),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    },
  );

  return new NextResponse(null, { status: 204 });
}
