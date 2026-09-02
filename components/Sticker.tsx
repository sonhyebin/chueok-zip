import { STICKER_MAP } from "@/lib/stickers";

/**
 * 스티커 칩 렌더러 — 미니홈피 반짝이 문구 감성.
 * 알 수 없는 id면 아무것도 그리지 않는다 (구버전/조작 데이터 안전 처리).
 */
export default function Sticker({
  id,
  size = "md",
}: {
  id: string;
  size?: "sm" | "md";
}) {
  const def = STICKER_MAP.get(id);
  if (!def) return null;
  return (
    <span
      className={`inline-flex items-center font-pixel rounded-md border-2 border-[#1d2733] whitespace-nowrap align-middle ${
        size === "sm" ? "text-[12px] px-1.5 py-0.5" : "text-[14px] px-2 py-1"
      }${def.glitter ? " sticker-glitter" : ""}`}
      style={{
        color: def.fg,
        background: `linear-gradient(135deg, ${def.bg[0]}, ${def.bg[1]})`,
        boxShadow: "1px 1px 0 rgba(29,39,51,0.85)",
        textShadow: "0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      {def.label}
    </span>
  );
}
