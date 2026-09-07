import { renderOgCollage, loadImageDataUrl, OG_SIZE } from "@/lib/og";
import { SERVICE_NAME, SERVICE_TAGLINE } from "@/lib/config";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${SERVICE_NAME} — ${SERVICE_TAGLINE}`;

/** 홈 공유 미리보기에 깔 대표 카드 사진 4장 (패션·학교·음식·거리 — 카테고리가 겹치지 않게) */
const COLLAGE = [
  "/images/years/2006/fashion/2006-fashion-1.jpg",
  "/images/years/2013/school/2013-school-1.jpg",
  "/images/years/2010/food/2010-food-2.jpg",
  "/images/years/1998/fashion/1998-fashion-1.jpg",
];

export default async function Image() {
  const photos = (await Promise.all(COLLAGE.map(loadImageDataUrl))).filter(
    (p): p is string => Boolean(p),
  );
  return renderOgCollage({
    photos,
    windowTitle: "시간여행.exe",
    title: SERVICE_NAME,
    subtitle: SERVICE_TAGLINE,
    footer: "출생연도만 입력하면 그 시절로 — 친구랑 타임캡슐까지",
  });
}
