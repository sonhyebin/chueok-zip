"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * 페이지 방문을 1회 기록한다 (link_visit).
 *
 * page: 어떤 화면인지 라벨 ("home" | "timeline" | "result" | "year-2004" 등).
 * 공유 링크로 들어오면 s= 채널 태그(k=카카오, s=네이티브·복사)와
 * memory= 카드 id가 함께 잡힌다.
 *
 * 집계 단위(card):
 *   - 공유된 카드 링크로 왔으면 그 카드 id (예: 2004-internet-2)
 *   - 아니면 페이지 라벨 (home / timeline / year-2004 …)
 * → /api/stats의 topCards에서 "무엇이 방문을 만들었는지"가 카드·페이지 단위로 보인다.
 *
 * 같은 세션에서 새로고침해도 중복 집계되지 않게 sessionStorage로 1회만 발송한다.
 */
export default function VisitTracker({ page }: { page: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memory = params.get("memory") ?? "";
    const s = params.get("s"); // k | s | null
    const src = s === "k" ? "kakao" : s === "s" ? "share" : "direct";
    const card = memory || page;

    const key = `visit:${page}:${card}:${src}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage 접근 불가 환경이면 그냥 1회 발송
    }

    trackEvent("link_visit", { page, src, card });
  }, [page]);

  return null;
}
