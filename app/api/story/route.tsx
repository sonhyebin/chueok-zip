import { NextRequest, NextResponse } from "next/server";
import { AVAILABLE_YEARS } from "@/data/memories";
import { isValidBirthYear } from "@/lib/age";
import { getCapsuleRecord } from "@/lib/capsuleStore";
import { renderStoryImage } from "@/lib/og";

export const runtime = "nodejs";

function clean(value: string | null, fallback: string, max = 12): string {
  const text = (value ?? "").trim().slice(0, max);
  return text || fallback;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  const born = Number(query.get("born"));
  if (isValidBirthYear(born)) {
    return renderStoryImage({
      badge: "내 학창시절.zip",
      title: `${born}년생`,
      subtitle: "우리가 좋아했던 노래와\n매일 하던 쓸데없는 짓들",
      footer: "같은 시절을 보낸 친구를 소환해보세요",
    });
  }

  const id = query.get("c") ?? "";
  let record = id ? await getCapsuleRecord(id) : null;
  for (let attempt = 0; id && record?.kind === "invite" && attempt < 8; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    record = await getCapsuleRecord(id);
  }
  if (record?.kind === "result") {
    return renderStoryImage({
      badge: `${record.year}년 타임캡슐`,
      title: `${record.aName} × ${record.bName}`,
      subtitle: "우리가 기억한 그때는\n얼마나 같았을까?",
      footer: "추억.zip에서 두 사람의 답을 열어보세요",
    });
  }

  const year = Number(query.get("year"));
  if (AVAILABLE_YEARS.includes(year)) {
    return renderStoryImage({
      badge: `${year}년 타임캡슐`,
      title: `${clean(query.get("a"), "나")} × ${clean(query.get("b"), "친구")}`,
      subtitle: "우리가 기억한 그때는\n얼마나 같았을까?",
      footer: "추억.zip에서 두 사람의 답을 열어보세요",
    });
  }

  return NextResponse.json({ error: "not found" }, { status: 404 });
}
