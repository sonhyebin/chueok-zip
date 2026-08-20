// 2005년 카드용 placeholder SVG 생성 스크립트
import { mkdirSync, writeFileSync } from "fs";

const OUT = "/Users/sonhyebin/Desktop/2000/public/images/years/2005";
mkdirSync(OUT, { recursive: true });

const GRAD = {
  music: ["#ffd6e8", "#c9b6ff"],
  drama: ["#ffe9b3", "#ffb3c1"],
  game: ["#b8f2c9", "#7fd8f0"],
  internet: ["#c5e8ff", "#8fc7ff"],
  device: ["#e0e6f0", "#aab8d0"],
  photo: ["#f5f5f5", "#cfd8e3"],
  fashion: ["#ffdcc2", "#ff9ec4"],
  food: ["#fff3b8", "#ffc9a3"],
};
const EMOJI = {
  music: "🎧", drama: "📺", game: "🎮", internet: "💻",
  device: "📱", photo: "📷", fashion: "👕", food: "🍢",
};

const items = [
  ["2005-music-1", "music", "윤도현 - 사랑했나봐"],
  ["2005-music-2", "music", "SG워너비 - 죄와 벌"],
  ["2005-music-3", "music", "버즈 - 겁쟁이"],
  ["2005-drama-1", "drama", "내 이름은 김삼순"],
  ["2005-drama-2", "drama", "무한도전 (무모한 도전)"],
  ["2005-game-1", "game", "카트라이더"],
  ["2005-game-2", "game", "던전앤파이터"],
  ["2005-internet-1", "internet", "싸이월드 미니홈피"],
  ["2005-internet-2", "internet", "MP3 플레이어"],
  ["2005-device-1", "device", "슬라이드폰"],
  ["2005-photo-1", "photo", "얼짱각도 45도"],
  ["2005-photo-2", "photo", "디카 날짜 스탬프"],
  ["2005-fashion-1", "fashion", "매직 스트레이트"],
  ["2005-fashion-2", "fashion", "샤기컷"],
  ["2005-food-1", "food", "컵떡볶이"],
  ["2005-food-2", "food", "슬러시"],
];

function svg({ c1, c2, emoji, title, big = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="rgba(255,255,255,0.12)"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <rect width="800" height="600" fill="url(#scan)"/>
  ${big
    ? `<text x="400" y="330" font-size="200" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#1d2733" opacity="0.85">${title}</text>
       <text x="400" y="430" font-size="44" text-anchor="middle" font-family="sans-serif" fill="#1d2733" opacity="0.55">${emoji}</text>`
    : `<circle cx="400" cy="300" r="130" fill="rgba(255,255,255,0.35)"/>
       <text x="400" y="300" font-size="130" text-anchor="middle" dominant-baseline="middle">${emoji}</text>`}
</svg>`;
}

for (const [id, cat, title] of items) {
  const [c1, c2] = GRAD[cat];
  writeFileSync(`${OUT}/${id}.svg`, svg({ c1, c2, emoji: EMOJI[cat], title }));
}
// 연도 대표(커버) 이미지 — 타임캡슐 결과 화면용
writeFileSync(
  `${OUT}/cover.svg`,
  svg({ c1: "#cfe9fb", c2: "#ff9dc0", emoji: "📼 그 시절의 우리", title: "2005", big: true }),
);
console.log("done:", items.length + 1, "files");
