"use client";

import { useState } from "react";
import { trackEvent, type ViralEvent } from "@/lib/analytics";
import { shareOrCopy } from "@/lib/share";

export default function ShareButton({
  label,
  title,
  text,
  url,
  variant = "primary",
  compact = false,
  eventName,
  eventProperties,
}: {
  label: string;
  title?: string;
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "blue";
  compact?: boolean;
  eventName?: ViralEvent;
  eventProperties?: Record<string, string | number>;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [failedUrl, setFailedUrl] = useState(url);

  async function handleShare() {
    const resolvedUrl = url
      ? new URL(url, window.location.origin).href
      : window.location.href;
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

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`pixel-btn ${variant}${compact ? " compact" : ""}`}
        onClick={handleShare}
      >
        {status === "copied" ? "📋 링크 복사 완료!" : label}
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
