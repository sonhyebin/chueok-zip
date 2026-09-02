/**
 * 그 시절 감성 도트 스티커 세트 — 버디버디 이모티콘 / 미니홈피 반짝이 문구.
 * 이미지 파일 없이 픽셀 폰트 + 그라데이션 칩으로 렌더링한다 (components/Sticker.tsx).
 * 서버(API 검증)와 클라이언트가 함께 쓰므로 데이터만 둔다.
 */

export type StickerDef = {
  id: string;
  /** 칩에 표시되는 문구 (이모지 포함 가능) */
  label: string;
  /** 글자색 */
  fg: string;
  /** 배경 그라데이션 [from, to] */
  bg: [string, string];
  /** 반짝이 애니메이션 여부 (미니홈피 글리터 감성) */
  glitter?: boolean;
};

export const STICKERS: StickerDef[] = [
  { id: "heart", label: "♥사랑해♥", fg: "#a80f4d", bg: ["#ffd6e8", "#ff9ec4"], glitter: true },
  { id: "kk", label: "ㅋㅋㅋㅋㅋ", fg: "#1d5c2a", bg: ["#d8ffd0", "#a8e05f"] },
  { id: "chuok", label: "추억돋네..", fg: "#4a2f8f", bg: ["#e4d9ff", "#c9b6ff"], glitter: true },
  { id: "8282", label: "☎8282", fg: "#8a4400", bg: ["#ffe9b3", "#ffc9a3"] },
  { id: "jul", label: "☆즐☆", fg: "#0f4d8a", bg: ["#c5e8ff", "#8fc7ff"] },
  { id: "bbuing", label: "뿌잉뿌잉>_<", fg: "#b0356e", bg: ["#ffe4f0", "#ffd6e8"] },
  { id: "dotori", label: "🌰도토리5개", fg: "#5c3a1d", bg: ["#f0e0c8", "#d9bf98"] },
  { id: "gsgs", label: "ㄳㄳ", fg: "#0f6b5c", bg: ["#d0f5ec", "#9fe3d2"] },
  { id: "aryeon", label: "아련하다..", fg: "#44536b", bg: ["#e8eef7", "#cfd8e3"] },
  { id: "naengmu", label: "냉무", fg: "#5a6b80", bg: ["#f0f2f5", "#dfe4ea"] },
  { id: "aja", label: "아자아자!", fg: "#9c1f1f", bg: ["#ffe0d6", "#ffb3a1"] },
  { id: "sojung", label: "★소중한추억★", fg: "#7a5800", bg: ["#fff3b8", "#ffd76a"], glitter: true },
];

export const STICKER_MAP: Map<string, StickerDef> = new Map(
  STICKERS.map((s) => [s.id, s]),
);
