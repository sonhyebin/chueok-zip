"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MemoryCard from "@/components/MemoryCard";
import BgmPlayer from "@/components/BgmPlayer";
import { getMemoriesForYear, getYearInfo, AVAILABLE_YEARS } from "@/data/memories";
import { ageInYear, loadBornYear } from "@/lib/age";

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
        <Link href={`/capsule/new?year=${year}`} className="pixel-btn primary">
          💌 그 친구에게 보내기
        </Link>
      </div>
    </div>
  );
}

export default function YearPage() {
  const params = useParams<{ year: string }>();
  const year = parseInt(params.year, 10);
  const [born, setBorn] = useState<number | null>(null);

  useEffect(() => {
    setBorn(loadBornYear());
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
  // 강한 추억 4~5개를 경험한 직후 첫 공유 CTA 노출 (피드가 짧으면 중간 지점)
  const firstCtaAfter = Math.min(5, Math.ceil(memories.length / 2));

  const feed: ReactNode[] = [];
  memories.forEach((item, i) => {
    feed.push(<MemoryCard key={item.id} item={item} index={i} />);
    if (i === firstCtaAfter - 1) {
      feed.push(<FriendCTA key="mid-cta" year={year} />);
    }
  });

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in pt-2">
        <h1 className="font-pixel text-[52px] leading-none">{year}</h1>
        {born ? (
          ageInYear(born, year) >= 1 ? (
            <p className="font-pixel text-[17px] mt-2">
              그때 당신은 <span className="text-[#e84d8a]">{ageInYear(born, year)}살</span>
              이었어요.
            </p>
          ) : (
            <p className="font-pixel text-[17px] mt-2">
              당신이 태어나기 전의 이야기예요.
            </p>
          )
        ) : (
          <p className="font-pixel text-[17px] mt-2">그 시절로 접속 중…</p>
        )}
        {info && (
          <p className="text-[13px] text-[#5a6b80] mt-1 font-pixel">
            {info.title}
          </p>
        )}
        <p className="text-[12.5px] text-[#7a8ba0] mt-1">
          ▼ 아래로 내리면서 천천히 기억해보세요
        </p>
      </header>

      {info?.song && (
        <div className="pop-in">
          <BgmPlayer song={info.song} />
        </div>
      )}

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
