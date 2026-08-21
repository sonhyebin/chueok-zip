"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import { AVAILABLE_YEARS, FEATURED_YEAR } from "@/data/memories";
import {
  ageInYear,
  isValidBirthYear,
  loadBornYear,
  saveBornYear,
  schoolYears,
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

  const years = schoolYears(born);
  const hasAnyData = years.some((y) => AVAILABLE_YEARS.includes(y));
  // 학창시절 범위 밖이어도 데이터가 있는 연도는 전부 보여준다
  const extraYears = AVAILABLE_YEARS.filter((y) => !years.includes(y));

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
      </header>

      <Window title="타임라인.exe" className="pop-in">
        <div className="grid grid-cols-2 gap-3">
          {years.map((year) => {
            const available = AVAILABLE_YEARS.includes(year);
            const age = ageInYear(born, year);
            if (!available) {
              return (
                <div
                  key={year}
                  className="pixel-btn secondary opacity-40 !cursor-default flex-col !gap-0 py-3"
                  aria-disabled
                >
                  <span className="text-[20px]">{year}</span>
                  <span className="text-[11px]">준비중</span>
                </div>
              );
            }
            return (
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
                <span className="text-[12px] opacity-90">{age}살</span>
              </Link>
            );
          })}
        </div>

        {extraYears.length > 0 && (
          <>
            <p className="speech mt-4">
              {hasAnyData
                ? "다른 연도의 추억도 구경할 수 있어요 👇"
                : `아직 이 시기의 추억 데이터를 준비 중이에요. 대신 ${AVAILABLE_YEARS[0]}~${AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]}년을 구경할 수 있어요 👇`}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {extraYears.map((year) => (
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
          </>
        )}
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
