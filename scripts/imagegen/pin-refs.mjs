// Pinterest 로그인 없이 검색 결과 핀 수집 (reference-only 용도)
// usage: node pin_scrape.mjs "1998년 패션" out/1998 [maxPins]
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const [q, outDir, maxArg] = process.argv.slice(2);
const MAX = Number(maxArg || 40);
mkdirSync(outDir, { recursive: true });

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({
  locale: "ko-KR", viewport: { width: 1400, height: 1400 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
});
const p = await ctx.newPage();
await p.goto("https://kr.pinterest.com/search/pins/?q=" + encodeURIComponent(q) + "&rs=typed", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(6000);

const pins = new Map();
async function collect() {
  const rows = await p.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('a[href^="/pin/"]')) {
      const img = a.querySelector("img");
      if (!img || !img.src.includes("pinimg")) continue;
      const id = a.getAttribute("href").split("/")[2];
      out.push({ id, src: img.src, alt: img.alt || "" });
    }
    // fallback: img without anchor
    if (!out.length) for (const img of document.querySelectorAll("img")) if (img.src.includes("pinimg")) out.push({ id: img.src.split("/").pop().split(".")[0], src: img.src, alt: img.alt || "" });
    return out;
  });
  for (const r of rows) if (!pins.has(r.id)) pins.set(r.id, r);
}
for (let i = 0; i < 8 && pins.size < MAX; i++) {
  await p.evaluate(() => { for (const el of document.querySelectorAll('[role="dialog"]')) el.remove(); document.body.style.overflow = "auto"; });
  await collect();
  await p.mouse.wheel(0, 1600);
  await p.waitForTimeout(2000);
}
await collect();
await b.close();

const list = [...pins.values()].slice(0, MAX);
let n = 0;
for (const pin of list) {
  const big = pin.src.replace(/\/\d+x\//, "/736x/");
  const file = join(outDir, pin.id + ".jpg");
  if (existsSync(file)) { n++; continue; }
  try {
    const res = await fetch(big, { headers: { Referer: "https://kr.pinterest.com/" } });
    if (!res.ok) throw new Error(res.status);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    pin.file = file; pin.url = "https://kr.pinterest.com/pin/" + pin.id + "/"; n++;
  } catch (e) { pin.err = String(e.message); }
}
writeFileSync(join(outDir, "_pins.json"), JSON.stringify({ query: q, pins: list }, null, 2));
console.log(`${q}: ${list.length} pins found, ${n} downloaded -> ${outDir}`);
