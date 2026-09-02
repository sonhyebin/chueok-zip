"use client";

import { useEffect, useState } from "react";
import { PARTNER_APPS, partnerStoreLink, type PartnerAppId } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

/**
 * 카드 하단의 제휴 앱 설치 CTA.
 * 스토어 링크는 SSR 시 iOS를 기본값으로 두고, 마운트 후 안드로이드면 교체한다.
 * href는 눈에 보이는 내용이 아니라서 교체돼도 깜빡임이 없다.
 */
export default function PartnerCta({
  app,
  label,
  note,
  campaign,
}: {
  app: PartnerAppId;
  label: string;
  note?: string;
  campaign: string;
}) {
  const [href, setHref] = useState(() => partnerStoreLink(app, "ios", campaign));

  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) {
      setHref(partnerStoreLink(app, "android", campaign));
    }
  }, [app, campaign]);

  return (
    <div className="partner-cta">
      <p className="partner-cta-tag">
        <span aria-hidden>✿</span> 우리가 만든 앱
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="pixel-btn primary compact"
        onClick={() =>
          trackEvent("partner_cta_click", { app, campaign })
        }
      >
        {label}
      </a>
      {note && <p className="partner-cta-note">{note}</p>}
      <p className="partner-cta-name">{PARTNER_APPS[app].name} · App Store · Google Play</p>
    </div>
  );
}
