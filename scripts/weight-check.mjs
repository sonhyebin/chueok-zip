/**
 * 페이지 전송량을 리소스 종류별로 집계 (Playwright, 모바일 뷰포트, 끝까지 스크롤)
 * 실행: UX_TEST_URL=http://localhost:3001 node scripts/weight-check.mjs /year/2006
 */
import { chromium, devices } from "playwright";

const BASE = process.env.UX_TEST_URL ?? "https://2000-steel.vercel.app";
const path = process.argv[2] ?? "/year/2006";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const byType = {};
const top = [];
page.on("response", async (res) => {
  let size = Number(res.headers()["content-length"] ?? 0);
  if (!size) { try { size = (await res.body()).length; } catch { size = 0; } }
  const url = res.url();
  const type = res.request().resourceType();
  const host = new URL(url).host;
  const key = /ytimg/.test(host) ? "image:ytimg" : type === "image" ? "image:local" : type;
  byType[key] = (byType[key] ?? 0) + size;
  top.push({ size, url: url.slice(0, 110) });
});
await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
});
await page.waitForLoadState("networkidle");
await browser.close();
const total = Object.values(byType).reduce((a, b) => a + b, 0);
console.log(`${path} total ${Math.round(total / 1024)}KB`);
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(14)} ${String(Math.round(v / 1024)).padStart(6)}KB`);
console.log("top 8:");
for (const t of top.sort((a, b) => b.size - a.size).slice(0, 8)) console.log(`  ${String(Math.round(t.size / 1024)).padStart(5)}KB ${t.url}`);
