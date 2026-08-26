import { NextRequest } from "next/server";
import { renderOgImage } from "@/lib/og";

export const runtime = "nodejs";

function clean(value: string | null, fallback: string, max = 40): string {
  const text = (value ?? "").trim().slice(0, max);
  return text || fallback;
}

function fitTitle(value: string, preferred: number): number {
  if (value.length > 18) return 48;
  if (value.length > 13) return 60;
  if (value.length > 9) return 72;
  return preferred;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  const type = query.get("type");

  if (type === "invite") {
    const year = clean(query.get("year"), "그 시절", 4);
    const from = clean(query.get("from"), "친구", 12);
    const title = `${from}의 초대`;
    return renderOgImage({
      windowTitle: "새 타임캡슐이 도착했습니다",
      title,
      titleSize: fitTitle(title, 88),
      subtitle: `${year}년 첫인상 질문`,
      footer: "내가 답해야 서로의 답이 열려요",
    });
  }

  if (type === "result") {
    const year = clean(query.get("year"), "그 시절", 4);
    const a = clean(query.get("a"), "나", 12);
    const b = clean(query.get("b"), "친구", 12);
    const title = `${a} × ${b}`;
    return renderOgImage({
      windowTitle: "타임캡슐 개봉 완료",
      title,
      titleSize: fitTitle(title, 82),
      subtitle: `${year}년의 우리`,
      footer: "두 사람이 기억한 그때를 나란히 열어보세요",
    });
  }

  if (type === "school") {
    const born = clean(query.get("born"), "그 시절", 4);
    return renderOgImage({
      windowTitle: "내 학창시절.zip",
      title: `${born}년생`,
      titleSize: 100,
      subtitle: "학창시절 소환 완료",
      footer: "같은 시절을 보낸 친구에게 보내보세요",
    });
  }

  const year = clean(query.get("year"), "그 시절", 4);
  const memory = clean(query.get("memory"), "그때 기억나?", 34);
  return renderOgImage({
    windowTitle: `${year}년의 추억`,
    title: year,
    subtitle: memory,
    footer: "야 이거 기억나?",
  });
}
