"use client";

import { useState } from "react";
import { shareOrCopy } from "@/lib/share";

export default function ShareButton({
  label,
  text,
  url,
  variant = "primary",
}: {
  label: string;
  text: string;
  url: string;
  variant?: "primary" | "secondary" | "blue";
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleShare() {
    const outcome = await shareOrCopy({ text, url });
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
        className={`pixel-btn ${variant}`}
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
            value={url}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}
