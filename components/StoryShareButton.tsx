"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function StoryShareButton({
  endpoint,
  filename,
  shareText,
  year,
}: {
  endpoint: string;
  filename: string;
  shareText: string;
  year: number;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "failed">(
    "idle",
  );

  async function makeStory() {
    setStatus("loading");
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("image generation failed");
      const blob = await response.blob();
      const file = new File([blob], filename, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text: shareText, files: [file] });
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
      trackEvent("story_image_share", { year });
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      className="pixel-btn secondary"
      onClick={makeStory}
      disabled={status === "loading"}
    >
      {status === "loading"
        ? "이미지 만드는 중..."
        : status === "done"
          ? "이미지 준비 완료!"
          : status === "failed"
            ? "다시 눌러주세요"
            : "📱 스토리 이미지 만들기"}
    </button>
  );
}
