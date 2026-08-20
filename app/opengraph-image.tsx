import { renderOgImage, OG_SIZE } from "@/lib/og";
import { SERVICE_NAME, SERVICE_TAGLINE } from "@/lib/config";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${SERVICE_NAME} — ${SERVICE_TAGLINE}`;

export default function Image() {
  return renderOgImage({
    windowTitle: "시간여행.exe",
    title: SERVICE_NAME,
    subtitle: SERVICE_TAGLINE,
    footer: "출생연도만 입력하면 그 시절로 — 친구랑 타임캡슐까지",
  });
}
