"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import OnlineBadge from "@/components/OnlineBadge";
import ShareButton from "@/components/ShareButton";
import StoryShareButton from "@/components/StoryShareButton";
import { AVAILABLE_YEARS, FEATURED_YEAR } from "@/data/memories";
import {
  ageInYear,
  isValidBirthYear,
  loadBornYear,
  saveBornYear,
  schoolYears,
} from "@/lib/age";

function SchoolYearsShare({ born }: { born: number }) {
  const years = schoolYears(born).filter((year) => AVAILABLE_YEARS.includes(year));
  const first = years[0] ?? AVAILABLE_YEARS[0];
  const last = years.at(-1) ?? AVAILABLE_YEARS.at(-1);
  const shareText = `${born}년생 학창시절 소환 완료ㅋㅋ\n너도 보면 자동으로 기억날걸?`;

  return (
    <Window title="내 학창시절.zip" className="pop-in">
      <div className="flex flex-col gap-3 text-center">
        <p className="font-pixel text-[20px] leading-snug">
          {born}년생의 추억 파일이
          <br />
          준비됐어요
        </p>
        <div className="flex justify-center gap-2 flex-wrap" aria-label="학창시절 연도 범위">
          <span className="badge !bg-[#ffd76a]">{first}</span>
          <span className="font-pixel text-[#7a8ba0] self-center">~</span>
          <span className="badge !bg-[#ffd6e8]">{last}</span>
        </div>
        <p className="text-[13px] text-[#5a6b80]">
          같은 시절을 보낸 친구에게 보내면 바로 이 타임라인이 열려요.
        </p>
        <ShareButton
          label="📼 친구에게 내 학창시절 보내기"
          text={shareText}
          url={`/timeline?born=${born}`}
          eventName="school_years_share"
          eventProperties={{ born }}
        />
        <StoryShareButton
          endpoint={`/api/story?born=${born}`}
          filename={`chueok-${born}-school-years.png`}
          shareText={shareText}
          year={born}
        />
      </div>
    </Window>
  );
}

function TimelineInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [born, setBorn] = useState<number | null>(null);

  useEffect(() => {
    const fromQuery = parseInt(searchParams.get("born") ?? "", 10);
    if (isValidBirthYear(fromQuery)) {
      saveBornYear(fromQuery);
      setBorn(fromQuery);
      return;
    }
    const saved = loadBornYear();
    if (saved) {
      setBorn(saved);
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  if (!born) return null;

  const ageLabel = (year: number) => {
    const age = ageInYear(born, year);
    return age >= 1 ? `${age}살` : "태어나기 전";
  };

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in">
        <p className="badge">🎒 {born}년생의 학창시절</p>
        <h1 className="font-pixel text-[26px] mt-3 leading-snug">
          어느 해로
          <br />
          돌아가볼까요?
        </h1>
        <div className="mt-2">
          <OnlineBadge />
        </div>
      </header>

      <SchoolYearsShare born={born} />

      <Window title="타임라인.exe" className="pop-in">
        <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_YEARS.map((year) => (
            <Link
              key={year}
              href={`/year/${year}`}
              className="pixel-btn blue flex-col !gap-0 py-3 relative"
            >
              {year === FEATURED_YEAR ? (
                <span className="absolute -top-2 -right-2 badge !bg-[#ffd76a] !text-[11px] !px-2">
                  ★ 추천
                </span>
              ) : null}
              <span className="text-[22px]">{year}</span>
              <span className="text-[12px] opacity-90">{ageLabel(year)}</span>
            </Link>
          ))}
        </div>
      </Window>

      <Link href="/" className="text-center text-[13px] text-[#5a6b80] font-pixel">
        ← 출생연도 다시 입력
      </Link>
    </main>
  );
}

export default function TimelineClient() {
  return (
    <Suspense>
      <TimelineInner />
    </Suspense>
  );
}
