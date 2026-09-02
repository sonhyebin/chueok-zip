"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import MemoryCard from "@/components/MemoryCard";
import BgmPlayer from "@/components/BgmPlayer";
import OnlineBadge from "@/components/OnlineBadge";
import VisitTracker from "@/components/VisitTracker";
import { getMemoriesForYear, getYearInfo, AVAILABLE_YEARS } from "@/data/memories";
import { koreanAgeInYear, loadBornYear } from "@/lib/age";
import { trackEvent } from "@/lib/analytics";

function FriendCTA({ year }: { year: number }) {
  return (
    <div className="window pop-in">
      <div className="window-titlebar">
        <span aria-hidden>💌</span>
        <span>새 쪽지가 도착했습니다</span>
      </div>
      <div className="p-4 flex flex-col gap-3 text-center">
        <p className="font-pixel text-[20px] leading-snug">
          이거 보니까
          <br />
          생각나는 친구 있어요?
        </p>
        <p className="text-[13.5px] text-[#5a6b80]">
          그 친구랑 {year}년의 타임캡슐을 만들 수 있어요
        </p>
        <Link
          href={`/capsule/new?year=${year}`}
          className="pixel-btn primary"
          onClick={() => trackEvent("chain_start", { year, source: "year_feed" })}
        >
          💌 그 친구에게 보내기
        </Link>
      </div>
    </div>
  );
}

export default function YearClient({ year }: { year: number }) {
  const [born, setBorn] = useState<number | null>(null);

  useEffect(() => {
    setBorn(loadBornYear());
    const memoryId = new URLSearchParams(window.location.search).get("memory");
    if (!memoryId) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById(`memory-${memoryId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (!AVAILABLE_YEARS.includes(year)) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[22px]">
          아직 {Number.isNaN(year) ? "이" : year + "년의"} 추억은 준비 중이에요 🚧
        </p>
        <Link href="/timeline" className="pixel-btn secondary">
          다른 연도 보기
        </Link>
      </main>
    );
  }

  const memories = getMemoriesForYear(year);
  const info = getYearInfo(year);
  const firstCtaAfter = Math.min(5, Math.ceil(memories.length / 2));

  const feed: ReactNode[] = [];
  memories.forEach((item, index) => {
    feed.push(<MemoryCard key={item.id} item={item} index={index} />);
    if (index === firstCtaAfter - 1) {
      feed.push(<FriendCTA key="mid-cta" year={year} />);
    }
  });

  return (
    <main className="page flex flex-col gap-5">
      <VisitTracker year={year} />
      <header className="text-center pop-in pt-2">
        <h1 className="font-pixel text-[52px] leading-none">{year}</h1>
        {born ? (
          koreanAgeInYear(born, year) >= 1 ? (
            <p className="font-pixel text-[17px] mt-2">
              그때 당신은{" "}
              <span className="text-[#e84d8a]">
                {koreanAgeInYear(born, year)}살
              </span>
              이었어요. <span className="text-[12px] text-[#7a8ba0]">(세는나이)</span>
            </p>
          ) : (
            <p className="font-pixel text-[17px] mt-2">
              당신이 태어나기 전의 이야기예요.
            </p>
          )
        ) : (
          <p className="font-pixel text-[17px] mt-2">그 시절로 접속 중…</p>
        )}
        {info ? (
          <p className="text-[13px] text-[#5a6b80] mt-1 font-pixel">
            {info.title}
          </p>
        ) : null}
        <p className="text-[12.5px] text-[#7a8ba0] mt-1">
          ▼ 아래로 내리면서 천천히 기억해보세요
        </p>
        <div className="mt-1.5">
          <OnlineBadge />
        </div>
      </header>

      {info?.song ? (
        <div className="pop-in">
          <BgmPlayer song={info.song} />
        </div>
      ) : null}

      <div className="flex flex-col gap-5">{feed}</div>

      <FriendCTA year={year} />

      <Link
        href="/timeline"
        className="text-center text-[13px] text-[#5a6b80] font-pixel"
      >
        ← 다른 연도 보기
      </Link>
    </main>
  );
}
