import { NextRequest } from "next/server";
import { renderOgImage, renderOgPhoto, loadImageDataUrl } from "@/lib/og";
import { MEMORIES } from "@/data/memories";
import { koreanAgeInYear, isValidBirthYear } from "@/lib/age";

export const runtime = "nodejs";

function clean(value: string | null, fallback: string, max = 40): string {
  const text = (value ?? "").trim().slice(0, max);
  return text || fallback;
}

/** MemoryCard.stampFor 와 같은 규칙 — 카드에 찍힌 날짜와 OG 날짜가 일치하도록 */
function stampFor(id: string, year: number): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const month = (h % 12) + 1;
  const day = (Math.floor(h / 12) % 28) + 1;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
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
  const memoryParam = query.get("memory") ?? "";
  const born = Number(query.get("born"));
  const age = isValidBirthYear(born) && /^\d{4}$/.test(year) ? koreanAgeInYear(born, Number(year)) : null;
  const badge = age ? `${year}년, 우리 ${age}살 때` : `${year}년의 추억`;

  // memory 가 카드 id면 카드 사진으로 렌더 (예: 2006-fashion-1)
  const card = MEMORIES.find((m) => m.id === memoryParam);
  if (card?.image) {
    const photo = await loadImageDataUrl(card.image);
    if (photo) {
      return renderOgPhoto({
        photo,
        badge,
        title: card.title,
        subtitle: card.subtitle ? `${card.subtitle} · 야 이거 기억나?` : "야 이거 기억나?",
        stamp: stampFor(card.id, card.year),
      });
    }
  }

  const memory = clean(card?.title ?? memoryParam, "그때 기억나?", 34);
  return renderOgImage({
    windowTitle: badge,
    title: year,
    subtitle: memory,
    footer: "야 이거 기억나?",
  });
}
