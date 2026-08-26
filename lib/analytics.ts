export type ViralEvent =
  | "memory_share"
  | "school_years_share"
  | "story_image_share"
  | "invite_created"
  | "invite_share"
  | "invite_open"
  | "invite_completed"
  | "result_share"
  | "chain_start";

export function trackEvent(
  event: ViralEvent,
  properties: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ event, properties });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/events",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
