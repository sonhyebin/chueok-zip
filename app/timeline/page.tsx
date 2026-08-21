"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import OnlineBadge from "@/components/OnlineBadge";
import { AVAILABLE_YEARS, FEATURED_YEAR } from "@/data/memories";
import {
  ageInYear,
  isValidBirthYear,
  loadBornYear,
  saveBornYear,
} from "@/lib/age";

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

  // 출생연도와 무관하게 데이터가 있는 모든 연도를 하나의 그리드로 보여준다
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

      <Window title="타임라인.exe" className="pop-in">
        <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_YEARS.map((year) => (
            <Link
              key={year}
              href={`/year/${year}`}
              className="pixel-btn blue flex-col !gap-0 py-3 relative"
            >
              {year === FEATURED_YEAR && (
                <span className="absolute -top-2 -right-2 badge !bg-[#ffd76a] !text-[11px] !px-2">
                  ★ 추천
                </span>
              )}
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

export default function TimelinePage() {
  return (
    <Suspense>
      <TimelineInner />
    </Suspense>
  );
}
