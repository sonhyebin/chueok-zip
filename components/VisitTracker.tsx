"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * 페이지 방문을 1회 기록한다 (link_visit).
 * 공유 링크로 들어오면 s= 채널 태그(k=카카오, s=네이티브·복사)와
 * memory= 카드 id가 함께 잡혀, "어떤 카드가 몇 명을 데려왔는지"를 집계할 수 있다.
 *
 * 같은 세션에서 새로고침해도 중복 집계되지 않게 sessionStorage로 1회만 발송한다.
 */
export default function VisitTracker({ year }: { year: number }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const card = params.get("memory") ?? "";
    const s = params.get("s"); // k | s | null
    const src = s === "k" ? "kakao" : s === "s" ? "share" : "direct";

    // 방문 단위 키: 연도+카드+채널 (같은 세션 새로고침은 1회로)
    const key = `visit:${year}:${card}:${src}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage 접근 불가 환경이면 그냥 1회 발송
    }

    const props: Record<string, string | number> = { year, src };
    if (card) props.card = card;
    trackEvent("link_visit", props);
  }, [year]);

  return null;
}
