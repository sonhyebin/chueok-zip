/** 서비스 이름 — 여기만 바꾸면 전체에 반영됩니다 */
export const SERVICE_NAME = "추억.zip";
export const SERVICE_TAGLINE = "그 시절로 돌아가는 가장 빠른 방법";

/* ── 제휴 앱 ───────────────────────────────────────
   카드 감성과 직결되는 카드에만 CTA로 붙인다.
   스토어 주소가 바뀌면 여기만 고치면 전체 카드에 반영된다. */

export const PARTNER_APPS = {
  uljjangcam: {
    name: "얼짱캠 2003",
    ios: "https://apps.apple.com/kr/app/id6787339271",
    android:
      "https://play.google.com/store/apps/details?id=com.mayacrew.haduricam",
  },
} as const;

export type PartnerAppId = keyof typeof PARTNER_APPS;

/**
 * 스토어별 캠페인 파라미터를 붙인 설치 링크.
 * App Store는 `ct`(캠페인 텍스트), Play 스토어는 `referrer`(UTM 인코딩) 규격을 쓴다.
 * campaign에는 어느 카드에서 눌렀는지 알 수 있도록 카드 id를 넘긴다.
 */
export function partnerStoreLink(
  appId: PartnerAppId,
  platform: "ios" | "android",
  campaign: string,
): string {
  const app = PARTNER_APPS[appId];

  if (platform === "android") {
    const referrer = new URLSearchParams({
      utm_source: "chueokzip",
      utm_medium: "card_cta",
      utm_campaign: campaign,
    }).toString();
    return `${app.android}&referrer=${encodeURIComponent(referrer)}`;
  }

  // App Store Connect에 provider token(pt)을 발급받으면 &pt=... 를 추가하면 된다.
  return `${app.ios}?ct=${encodeURIComponent(`chueokzip-${campaign}`)}&mt=8`;
}
