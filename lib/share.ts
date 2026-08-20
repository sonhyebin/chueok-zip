export type ShareOutcome = "shared" | "copied" | "failed";

/** 구형/인앱 브라우저용 클립보드 폴백 (execCommand) */
function legacyCopy(value: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Web Share API를 우선 사용하고, 미지원 환경(카카오톡 인앱 등)에서는
 * 클립보드 복사(async API → execCommand 순)로 폴백.
 */
export async function shareOrCopy(opts: {
  text: string;
  url: string;
}): Promise<ShareOutcome> {
  const { text, url } = opts;
  const payload = `${text}\n${url}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text, url });
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return "failed"; // 사용자가 공유 시트를 닫음
      }
      // 그 외 오류는 클립보드 폴백
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
      return "copied";
    }
  } catch {
    // execCommand 폴백으로 진행
  }

  return legacyCopy(payload) ? "copied" : "failed";
}
