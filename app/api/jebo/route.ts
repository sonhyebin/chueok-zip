import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { AVAILABLE_YEARS } from "@/data/memories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 제보 게시판 API — "그때 그 사진, 저희가 올려드릴게요"
 *
 * 안전 설계:
 * - 사진은 공개 목록에 절대 노출하지 않는다. 운영자만 blob 경로로 확인 후
 *   검수를 거쳐 카드에 반영한다 (초상권·저작권 사고 예방).
 * - 공개되는 것은 닉네임·연도·설명 텍스트뿐.
 * - 업로드 시 권리 보유 동의를 필수로 받는다.
 */

const PREFIX = "jebo/";
const MAX_LIST = 60;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type Jebo = {
  id: string;
  name: string;
  year?: number;
  text: string;
  ts: number;
  /** 사진 첨부 여부만 공개 (경로는 비공개) */
  hasImage: boolean;
  /** 아래는 응답에서 제거되는 비공개 필드 */
  contact?: string;
  imagePath?: string;
};

/** 공개 응답에서 개인정보·이미지 경로를 제거 */
function toPublic(j: Jebo) {
  return {
    id: j.id,
    name: j.name,
    year: j.year,
    text: j.text,
    ts: j.ts,
    hasImage: j.hasImage,
  };
}

export async function GET() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const metas = blobs.filter((b) => b.pathname.endsWith(".json"));
  metas.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const items = (
    await Promise.all(
      metas.slice(0, MAX_LIST).map(async (b) => {
        try {
          const r = await fetch(b.url, { cache: "force-cache" });
          return toPublic((await r.json()) as Jebo);
        } catch {
          return null;
        }
      }),
    )
  ).filter(Boolean);
  return NextResponse.json(
    { count: metas.length, items },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad form" }, { status: 400 });
  }

  // 허니팟 — 봇이 채우는 숨은 필드
  if (form.get("website")) return NextResponse.json({ ok: true });

  const name = String(form.get("name") ?? "").trim().slice(0, 12);
  const text = String(form.get("text") ?? "").trim().slice(0, 300);
  const contact = String(form.get("contact") ?? "").trim().slice(0, 80);
  const yearRaw = parseInt(String(form.get("year") ?? ""), 10);
  const year = AVAILABLE_YEARS.includes(yearRaw) ? yearRaw : undefined;
  const agreed = String(form.get("agree") ?? "") === "1";

  if (name.length < 1 || text.length < 5) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const file = form.get("image");
  let imagePath: string | undefined;
  const ts = Date.now();
  const id = `${String(ts).padStart(15, "0")}-${Math.random().toString(36).slice(2, 8)}`;

  if (file instanceof File && file.size > 0) {
    // 사진을 보낼 때만 권리 동의를 요구한다
    if (!agreed) {
      return NextResponse.json({ error: "need consent" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES || !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "bad image" }, { status: 400 });
    }
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    // addRandomSuffix로 경로를 추측 불가능하게 만든다 (공개 목록에는 노출하지 않음)
    const blob = await put(`${PREFIX}img/${id}.${ext}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });
    imagePath = blob.url;
  }

  const jebo: Jebo = {
    id,
    name,
    text,
    ts,
    hasImage: Boolean(imagePath),
    ...(year ? { year } : {}),
    ...(contact ? { contact } : {}),
    ...(imagePath ? { imagePath } : {}),
  };

  await put(`${PREFIX}${id}.json`, JSON.stringify(jebo), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json({ ok: true, item: toPublic(jebo) });
}
