/**
 * 추억.zip UX 자동 테스트 (Playwright)
 *
 * 실행: node scripts/ux-test.mjs
 * - 배포본(https://2000-steel.vercel.app)을 모바일 뷰포트(390×844)로 직접 사용
 * - 전체 사용자 플로우: 출생연도 → 타임라인 → 2005 피드 → 공유 → 2인 타임캡슐 → 결과
 * - 스크린샷: screenshots/ux-test/
 * - console/network 오류 수집 → 콘솔에 JSON 리포트 출력
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.env.UX_TEST_URL ?? "https://2000-steel.vercel.app";
const SHOT_DIR = "screenshots/ux-test";
mkdirSync(SHOT_DIR, { recursive: true });

const iphone = {
  ...devices["iPhone 13"],
  viewport: { width: 390, height: 844 },
};

const issues = { console: [], pageErrors: [], network: [], notes: [] };

function watch(page, label) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      issues.console.push({ label, type: msg.type(), text: msg.text().slice(0, 300) });
    }
  });
  page.on("pageerror", (err) => {
    issues.pageErrors.push({ label, text: String(err).slice(0, 300) });
  });
  page.on("requestfailed", (req) => {
    issues.network.push({ label, kind: "failed", url: req.url().slice(0, 200), err: req.failure()?.errorText });
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      issues.network.push({ label, kind: `HTTP ${res.status()}`, url: res.url().slice(0, 200) });
    }
  });
}

async function shot(page, name) {
  await page.screenshot({ path: `${SHOT_DIR}/${name}` });
  console.log("📸", name);
}

async function noHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.scrollingElement;
    return { scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth, ok: doc.scrollWidth <= window.innerWidth + 1 };
  });
}

const A_ANSWERS = [
  "중학교 1학년 때 같은 반",
  "학교 앞 떡볶이집",
  "SG워너비 노래 전부 다",
  "말이 별로 없는 애인 줄 알았음",
  "그때 사진 좀 많이 찍어둘걸",
];
const B_ANSWERS = [
  "중1 때 짝꿍으로 만났지",
  "문방구 앞 오락기",
  "버즈 겁쟁이 맨날 불렀잖아",
  "처음엔 좀 무서워 보였는데 완전 반대였음",
  "우리 그때처럼 자주 보자",
];

const results = [];
const pass = (name, detail = "") => { results.push({ name, ok: true, detail }); console.log("✅", name, detail); };
const fail = (name, detail = "") => { results.push({ name, ok: false, detail }); console.log("❌", name, detail); };

const browser = await chromium.launch();

try {
  // ─────────── 사용자 A (혜빈) ───────────
  const ctxA = await browser.newContext({ ...iphone });
  await ctxA.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
  const a = await ctxA.newPage();
  watch(a, "A");

  // STEP 1: 첫 화면
  await a.goto(BASE, { waitUntil: "networkidle" });
  await shot(a, "01-home.png");
  const ov1 = await noHorizontalOverflow(a);
  ov1.ok ? pass("홈: 가로 오버플로 없음") : fail("홈: 가로 오버플로", JSON.stringify(ov1));
  (await a.getByText("몇 년생이에요?").isVisible()) ? pass("홈: 핵심 질문 노출") : fail("홈: 핵심 질문 미노출");

  // STEP 2: 출생연도 입력
  const yearInput = a.getByLabel("출생연도");
  const ctaBtn = a.getByRole("button", { name: /내 학창시절로 돌아가기/ });
  (await ctaBtn.isDisabled()) ? pass("홈: 입력 전 CTA 비활성") : fail("홈: 입력 전 CTA가 활성 상태");
  await yearInput.fill("1992");
  (await ctaBtn.isEnabled()) ? pass("홈: 4자리 입력 후 CTA 활성") : fail("홈: 입력 후에도 CTA 비활성");
  await ctaBtn.click();
  await a.waitForURL("**/timeline**");
  pass("홈 → 타임라인 이동", a.url());

  // STEP 3: 타임라인
  await a.waitForLoadState("networkidle");
  await shot(a, "02-timeline-1992.png");
  const y2003 = await a.getByText("2003", { exact: true }).count();
  const y2010 = await a.getByText("2010", { exact: true }).count();
  y2003 > 0 && y2010 > 0
    ? pass("타임라인: 1992년생 → 2003~2010 표시")
    : fail("타임라인: 연도 범위 이상", `2003:${y2003} 2010:${y2010}`);
  (await a.getByText("★ 추천").isVisible()) ? pass("타임라인: 2005 추천 배지") : fail("타임라인: 추천 배지 없음");
  (await a.getByText("준비중").count()) > 0 ? pass("타임라인: 준비중 연도 구분") : fail("타임라인: 준비중 표시 없음");

  // STEP 4: 2005 피드 진입
  await a.getByRole("link", { name: /2005/ }).click();
  await a.waitForURL("**/year/2005");
  await a.waitForLoadState("networkidle");
  (await a.getByText("그때 당신은").isVisible()) ? pass("피드: 당시 나이 문구") : fail("피드: 당시 나이 문구 없음");
  (await a.getByText("13살").isVisible()) ? pass("피드: 13살 계산 정확") : fail("피드: 나이 계산 오류");
  await shot(a, "03-2005-feed-top.png");

  // STEP 5: 스크롤 + 카테고리 연속 확인
  const cats = await a.locator("article .window-titlebar span:nth-child(2)").allInnerTexts();
  const consecutive = cats.filter((c, i) => i > 0 && c === cats[i - 1]);
  consecutive.length === 0
    ? pass("피드: 동일 카테고리 연속 없음", `${cats.length}개 카드`)
    : fail("피드: 동일 카테고리 연속", consecutive.join(","));
  await a.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.4 }));
  await a.waitForTimeout(800);
  await shot(a, "04-2005-feed-middle.png");
  const ov2 = await noHorizontalOverflow(a);
  ov2.ok ? pass("피드: 가로 오버플로 없음") : fail("피드: 가로 오버플로", JSON.stringify(ov2));

  // 친구 공유 CTA
  const midCta = a.getByText("생각나는 친구 있어요?").first();
  await midCta.scrollIntoViewIfNeeded();
  await a.waitForTimeout(600);
  await shot(a, "05-share-cta.png");
  (await midCta.isVisible()) ? pass("피드: 친구 CTA 노출") : fail("피드: 친구 CTA 미노출");

  // STEP 6: A가 타임캡슐 작성
  await a.getByRole("link", { name: /그 친구에게 보내기/ }).first().click();
  await a.waitForURL("**/capsule/new**");
  await a.getByPlaceholder("예: 혜빈").fill("혜빈");
  const taA = a.locator("textarea");
  for (let i = 0; i < A_ANSWERS.length; i++) await taA.nth(i).fill(A_ANSWERS[i]);
  const submitA = a.getByRole("button", { name: /타임캡슐에 넣기/ });
  (await submitA.isEnabled()) ? pass("캡슐(A): 전부 입력 시 제출 활성") : fail("캡슐(A): 제출 버튼 비활성");
  await submitA.click();
  await a.getByText("이제 그 친구에게").waitFor();
  pass("캡슐(A): 공유 준비 화면 도달");

  // Web Share 미지원(headless) → 클립보드 폴백 확인
  const hasNativeShare = await a.evaluate(() => typeof navigator.share === "function");
  issues.notes.push(`navigator.share 지원: ${hasNativeShare} (headless Chromium — native share sheet 테스트 불가)`);
  await a.getByRole("button", { name: /그 친구에게 보내기/ }).click();
  await a.waitForTimeout(500);
  const clip = await a.evaluate(() => navigator.clipboard.readText());
  const inviteUrl = clip.match(/https?:\/\/\S+/)?.[0];
  inviteUrl
    ? pass("캡슐(A): 링크 복사 폴백 동작", inviteUrl.slice(0, 60) + "…")
    : fail("캡슐(A): 클립보드에 링크 없음", clip.slice(0, 80));
  issues.notes.push(`초대 URL 길이: ${inviteUrl?.length ?? "N/A"}자`);
  (await a.getByText("링크 복사 완료").isVisible().catch(() => false))
    ? pass("캡슐(A): 복사 완료 피드백 표시")
    : fail("캡슐(A): 복사 피드백 없음");

  // ─────────── 사용자 B (수진) — 새 컨텍스트 (localStorage 격리) ───────────
  const ctxB = await browser.newContext({ ...iphone });
  const b = await ctxB.newPage();
  watch(b, "B");

  await b.goto(inviteUrl, { waitUntil: "networkidle" });
  await shot(b, "06-capsule-invite.png");
  (await b.getByText("타임캡슐을 보냈어요").isVisible()) ? pass("캡슐(B): 초대 랜딩 문구") : fail("캡슐(B): 랜딩 문구 없음");
  (await b.getByText("볼 수 없어요").isVisible()) ? pass("캡슐(B): 답변 숨김 안내") : fail("캡슐(B): 숨김 안내 없음");
  const leaked = await b.getByText(A_ANSWERS[0]).count();
  leaked === 0 ? pass("캡슐(B): A 답변 화면 비노출") : fail("캡슐(B): A 답변이 미리 노출됨!");

  await b.getByRole("button", { name: /나도 답하러 가기/ }).click();
  await b.getByPlaceholder("예: 혜빈").fill("수진");
  const taB = b.locator("textarea");
  for (let i = 0; i < B_ANSWERS.length; i++) await taB.nth(i).fill(B_ANSWERS[i]);
  await shot(b, "07-capsule-form.png");
  await b.getByRole("button", { name: /타임캡슐 열기/ }).click();
  await b.waitForURL("**/capsule/result**");
  await b.waitForLoadState("networkidle");
  pass("캡슐(B): 결과 페이지 도달", b.url().slice(0, 70) + "…");

  // STEP 8: 결과 검증
  (await b.getByText("혜빈 × 수진").isVisible()) ? pass("결과: 제목 '혜빈 × 수진'") : fail("결과: 제목 이상");
  (await b.getByText("수진이가").count()) > 0 || (await b.getByText("수진이(가)").count()) > 0
    ? pass("결과: 조사(이/가) 처리")
    : fail("결과: 조사 처리 확인 불가");
  (await b.getByText(A_ANSWERS[3]).isVisible()) ? pass("결과: A 답변 표시") : fail("결과: A 답변 누락");
  (await b.getByText(B_ANSWERS[3]).isVisible()) ? pass("결과: B 답변 표시") : fail("결과: B 답변 누락");
  (await b.getByText("타임캡슐이").isVisible()) ? pass("결과: 완성 메시지") : fail("결과: 완성 메시지 없음");
  (await b.getByRole("button", { name: /이 타임캡슐 공유하기/ }).isVisible())
    ? pass("결과: 재공유 CTA")
    : fail("결과: 재공유 CTA 없음");
  await b.screenshot({ path: `${SHOT_DIR}/08-capsule-result.png`, fullPage: true });
  console.log("📸 08-capsule-result.png (fullPage)");

  // STEP 9: /?born=1992 직접 진입 (신규 컨텍스트)
  const ctxC = await browser.newContext({ ...iphone });
  const c = await ctxC.newPage();
  watch(c, "C");
  await c.goto(`${BASE}/?born=1992`, { waitUntil: "networkidle" });
  c.url().includes("/timeline")
    ? pass("직접 진입: /?born=1992 → 타임라인 자동 이동")
    : fail("직접 진입: 타임라인 미이동", c.url());

  // STEP 10: localStorage 유지
  await a.goto(BASE, { waitUntil: "networkidle" });
  const savedVal = await a.getByLabel("출생연도").inputValue();
  savedVal === "1992" ? pass("localStorage: 새로고침 후 1992 유지") : fail("localStorage: 값 유실", savedVal);
  await a.evaluate(() => localStorage.clear());
  await a.reload({ waitUntil: "networkidle" });
  const clearedVal = await a.getByLabel("출생연도").inputValue();
  clearedVal === "" ? pass("localStorage: 삭제 후 신규 사용자 상태") : fail("localStorage: 삭제 후에도 값 존재", clearedVal);

  // 추가 뷰포트 레이아웃 확인
  for (const [w, h] of [[375, 667], [393, 852], [430, 932]]) {
    const ctxV = await browser.newContext({ ...iphone, viewport: { width: w, height: h } });
    const v = await ctxV.newPage();
    await v.goto(`${BASE}/year/2005`, { waitUntil: "networkidle" });
    const ov = await noHorizontalOverflow(v);
    ov.ok
      ? pass(`뷰포트 ${w}×${h}: 오버플로 없음`)
      : (fail(`뷰포트 ${w}×${h}: 가로 오버플로`, JSON.stringify(ov)),
        await v.screenshot({ path: `${SHOT_DIR}/issue-overflow-${w}x${h}.png` }));
    await ctxV.close();
  }

  await ctxA.close(); await ctxB.close(); await ctxC.close();
} finally {
  await browser.close();
}

console.log("\n══════════ RESULT SUMMARY ══════════");
console.log(JSON.stringify({
  passed: results.filter(r => r.ok).length,
  failed: results.filter(r => !r.ok).map(r => `${r.name}: ${r.detail}`),
  issues,
}, null, 2));
