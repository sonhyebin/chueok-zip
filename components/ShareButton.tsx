"use client";

import { useState } from "react";
import { trackEvent, type ViralEvent } from "@/lib/analytics";
import { shareOrCopy } from "@/lib/share";
import { isKakaoConfigured, shareKakao } from "@/lib/kakao";

export default function ShareButton({
  label,
  title,
  text,
  url,
  imageUrl,
  variant = "primary",
  compact = false,
  eventName,
  eventProperties,
}: {
  label: string;
  title?: string;
  text: string;
  url: string;
  /** 카카오 공유 카드 썸네일. 없으면 사이트 대표 OG 이미지를 쓴다. */
  imageUrl?: string;
  variant?: "primary" | "secondary" | "blue";
  compact?: boolean;
  eventName?: ViralEvent;
  eventProperties?: Record<string, string | number>;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [failedUrl, setFailedUrl] = useState(url);
  const kakaoOn = isKakaoConfigured();

  function resolve() {
    return url
      ? new URL(url, window.location.origin).href
      : window.location.href;
  }

  async function handleShare() {
    const resolvedUrl = resolve();
    setFailedUrl(resolvedUrl);
    const outcome = await shareOrCopy({ title, text, url: resolvedUrl });
    if ((outcome === "shared" || outcome === "copied") && eventName) {
      trackEvent(eventName, { ...eventProperties, outcome });
    }
    if (outcome === "copied") {
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } else if (outcome === "failed") {
      // 공유/복사가 모두 막힌 환경(일부 인앱 브라우저):
      // 링크를 직접 보여주고 길게 눌러 복사하게 한다
      setStatus("failed");
    }
  }

  async function handleKakao() {
    const resolvedUrl = resolve();
    setFailedUrl(resolvedUrl);
    const ok = await shareKakao({
      title: title ?? text,
      description: text,
      imageUrl:
        imageUrl ?? new URL("/opengraph-image", window.location.origin).href,
      url: resolvedUrl,
    });
    if (ok) {
      if (eventName) {
        trackEvent(eventName, { ...eventProperties, outcome: "kakao" });
      }
      return;
    }
    // SDK 로드 실패 등 → 기존 공유/복사 흐름으로 폴백
    await handleShare();
  }

  return (
    <div className="flex flex-col gap-2">
      {kakaoOn && (
        <button
          type="button"
          className={`pixel-btn kakao${compact ? " compact" : ""}`}
          onClick={handleKakao}
        >
          카카오톡으로 보내기
        </button>
      )}
      <button
        type="button"
        className={`pixel-btn ${variant}${compact ? " compact" : ""}`}
        onClick={handleShare}
      >
        {status === "copied"
          ? "📋 링크 복사 완료!"
          : kakaoOn
            ? "🔗 링크 복사 · 다른 앱으로"
            : label}
      </button>
      {status === "failed" && (
        <div className="flex flex-col gap-1">
          <p className="text-[12px] text-[#5a6b80] text-center">
            아래 링크를 길게 눌러 복사해주세요
          </p>
          <input
            className="pixel-input !text-[13px] text-center"
            readOnly
            value={failedUrl}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}
