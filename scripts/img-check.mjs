/**
 * 전 연도 피드 이미지 로드 점검 (Playwright)
 * 실행: UX_TEST_URL=http://localhost:3000 node scripts/img-check.mjs
 * - /year/1998 ~ /year/2016 을 모바일 뷰포트로 열고 끝까지 스크롤
 * - 로드 실패 이미지(naturalWidth 0), HTTP 4xx/5xx, 콘솔 에러, 페이지 전송량을 출력
 * - 옵션: SHOT=1 → screenshots/img-check/<year>.png 저장
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.env.UX_TEST_URL ?? "https://2000-steel.vercel.app";
const YEARS = Array.from({ length: 19 }, (_, i) => 1998 + i);
if (process.env.SHOT) mkdirSync("screenshots/img-check", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
const report = [];
for (const year of YEARS) {
  const page = await ctx.newPage();
  const bad = [];
  const errors = [];
  let bytes = 0;
  page.on("response", async (res) => {
    if (res.status() >= 400) bad.push(`HTTP ${res.status()} ${res.url().slice(0, 120)}`);
    const len = Number(res.headers()["content-length"] ?? 0);
    bytes += len;
  });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  await page.goto(`${BASE}/year/${year}`, { waitUntil: "networkidle" });
  // 끝까지 스크롤해서 lazy 이미지까지 로드
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  });
  await page.waitForLoadState("networkidle");
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll("article img")].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 })),
  );
  const broken = imgs.filter((i) => !i.ok).map((i) => i.src.slice(0, 120));
  const cards = await page.locator("article").count();
  if (process.env.SHOT) await page.screenshot({ path: `screenshots/img-check/${year}.png`, fullPage: false });
  report.push({ year, cards, imgs: imgs.length, broken, http: bad, errors, kb: Math.round(bytes / 1024) });
  console.log(`${year}: 카드 ${cards} · 이미지 ${imgs.length} · 깨짐 ${broken.length} · HTTP오류 ${bad.length} · 콘솔오류 ${errors.length} · ${Math.round(bytes / 1024)}KB`);
  await page.close();
}
await browser.close();
const problems = report.filter((r) => r.broken.length || r.http.length || r.errors.length);
console.log(JSON.stringify({ problems }, null, 2));
