"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import OnlineBadge from "@/components/OnlineBadge";
import PhoneCarousel from "@/components/PhoneCarousel";
import YearPicker from "@/components/YearPicker";
import ShareButton from "@/components/ShareButton";
import StoryShareButton from "@/components/StoryShareButton";
import VisitTracker from "@/components/VisitTracker";
import { AVAILABLE_YEARS } from "@/data/memories";
import {
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

  return (
    <main className="page flex flex-col gap-5">
      <VisitTracker page="timeline" />
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
        <YearPicker born={born} />
      </Window>

      <PhoneCarousel born={born} />

      {/* 제보함 — 사용자가 가진 그 시절 사진을 받아 카드로 만드는 통로 */}
      <Window title="추억 제보함.exe" className="pop-in">
        <div className="flex flex-col gap-2 text-center">
          <p className="font-pixel text-[17px] leading-snug">
            📮 서랍 속에 그때 사진 있어요?
          </p>
          <p className="text-[12.5px] text-[#5a6b80] leading-relaxed">
            알려주시면 확인하고 카드로 만들어 올려드릴게요.
          </p>
          <Link href="/jebo" className="pixel-btn secondary !py-2.5 !text-[14px]">
            제보하러 가기
          </Link>
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
