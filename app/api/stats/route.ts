import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 공유 링크 방문 통계.
 *   GET /api/stats?days=7          최근 7일(기본) 방문 집계
 *   GET /api/stats?days=30&year=2004  특정 연도만
 *
 * link_visit 이벤트는 events/<날짜>/link_visit/<채널>/<카드>/<id>.json 경로로
 * 쌓이므로, 파일을 열지 않고 목록(list)만으로 카드/채널/일자별 수를 센다.
 *
 * STATS_TOKEN 환경변수가 설정돼 있으면 ?key=<토큰> 이 일치해야 조회 가능.
 */
export async function GET(req: NextRequest) {
  const token = process.env.STATS_TOKEN;
  if (token && req.nextUrl.searchParams.get("key") !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const days = Math.min(
    90,
    Math.max(1, Number(req.nextUrl.searchParams.get("days") ?? 7)),
  );
  const yearFilter = req.nextUrl.searchParams.get("year"); // 카드 id 접두사로 필터

  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  let total = 0;
  const byChannel: Record<string, number> = {};
  const byCard: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  await Promise.all(
    dates.map(async (date) => {
      let cursor: string | undefined;
      do {
        const res = await list({
          prefix: `events/${date}/link_visit/`,
          limit: 1000,
          cursor,
        });
        for (const blob of res.blobs) {
          // events/<date>/link_visit/<channel>/<card>/<id>.json
          const parts = blob.pathname.split("/");
          const channel = parts[3] ?? "direct";
          const card = parts[4] ?? "none";
          if (yearFilter && !card.startsWith(`${yearFilter}-`)) continue;
          total += 1;
          byChannel[channel] = (byChannel[channel] ?? 0) + 1;
          byCard[card] = (byCard[card] ?? 0) + 1;
          byDay[date] = (byDay[date] ?? 0) + 1;
        }
        cursor = res.hasMore ? res.cursor : undefined;
      } while (cursor);
    }),
  );

  const topCards = Object.entries(byCard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([card, count]) => ({ card, count }));

  return NextResponse.json({
    range: { days, from: dates[dates.length - 1], to: dates[0] },
    total,
    byChannel,
    byDay,
    topCards,
  });
}
