"use client";

import { useEffect, useState } from "react";

function sid(): string {
  try {
    let v = sessionStorage.getItem("memory.sid");
    if (!v) {
      v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      sessionStorage.setItem("memory.sid", v);
    }
    return v;
  } catch {
    return "anon";
  }
}

/** "지금 n명이 추억여행 중" 실시간(근사) 접속자 배지 */
export default function OnlineBadge() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    async function beat() {
      try {
        const r = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sid: sid() }),
        });
        const d = await r.json();
        if (alive) setOnline(Math.max(1, d.online ?? 1));
      } catch {}
    }
    beat();
    const t = setInterval(beat, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (online === null) return null;

  return (
    <p className="font-pixel text-[12px] text-[#4a9e5c] flex items-center justify-center gap-1.5">
      <span
        className="inline-block w-2 h-2 rounded-full bg-[#4ade80]"
        style={{ boxShadow: "0 0 6px #4ade80" }}
        aria-hidden
      />
      지금 {online}명이 추억여행 중
    </p>
  );
}
