"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AVAILABLE_YEARS, FEATURED_YEAR } from "@/data/memories";
import { koreanAgeInYear } from "@/lib/age";

/**
 * 옛날 윈도우 대화상자풍 연도 선택.
 * - 목록은 항상 펼쳐진 스크롤 리스트박스(Win98 스타일) — 접혀서 안 보이는 일이 없다.
 * - 위 입력칸에 숫자를 치면 연도가 필터링된다 (98 → 1998).
 * - 나이는 그 시절 기억과 맞는 "세는나이"로 표시한다.
 */
export default function YearPicker({ born }: { born: number }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const years = useMemo(
    () =>
      query.trim()
        ? AVAILABLE_YEARS.filter((y) => String(y).includes(query.trim()))
        : AVAILABLE_YEARS,
    [query],
  );

  const go = (year: number) => router.push(`/year/${year}`);

  const ageLabel = (year: number) => {
    const age = koreanAgeInYear(born, year);
    return age >= 1 ? `${age}살` : "태어나기 전";
  };

  const sunken: React.CSSProperties = {
    background: "var(--paper)",
    border: "2px solid var(--ink)",
    boxShadow: "inset 2px 2px 0 rgba(29,39,51,0.25)",
  };

  return (
    <div>
      <p className="font-pixel text-[14px] mb-1.5">
        열기(<span className="underline">O</span>): 돌아갈 연도를 고르세요
      </p>

      <div className="flex items-stretch mb-2" style={sunken}>
        <input
          type="text"
          inputMode="numeric"
          aria-label="연도 검색"
          placeholder={`숫자로 검색 — 예: ${FEATURED_YEAR}`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.replace(/[^0-9]/g, ""));
            setHighlight(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, years.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter") {
              const y = years[highlight] ?? years[0];
              if (y) go(y);
            }
          }}
          className="flex-1 min-w-0 px-3 py-2.5 font-pixel text-[16px] outline-none bg-transparent"
        />
        <span
          className="px-3 flex items-center font-pixel text-[12px] shrink-0 text-[#5a6b80]"
          style={{ borderLeft: "2px solid var(--ink)", background: "var(--sky-200)" }}
          aria-hidden
        >
          🔍
        </span>
      </div>

      <ul
        role="listbox"
        aria-label="연도 목록"
        className="max-h-[318px] overflow-y-auto"
        style={sunken}
      >
        {years.length === 0 && (
          <li className="px-3 py-2.5 text-[13px] text-[#7a8ba0]">
            그런 연도는 없어요 ({AVAILABLE_YEARS[0]}~{AVAILABLE_YEARS.at(-1)})
          </li>
        )}
        {years.map((year, i) => (
          <li key={year} role="option" aria-selected={i === highlight}>
            <button
              type="button"
              onClick={() => go(year)}
              onMouseEnter={() => setHighlight(i)}
              className="w-full flex items-center justify-between px-3 py-2 font-pixel text-[16px] text-left"
              style={
                i === highlight
                  ? { background: "var(--xp-blue)", color: "#fff" }
                  : undefined
              }
            >
              <span>
                {year}
                {year === FEATURED_YEAR && (
                  <span
                    className="ml-1.5"
                    aria-label="추천"
                    style={{
                      color: i === highlight ? "#ffd76a" : "var(--cy-orange)",
                    }}
                  >
                    ★
                  </span>
                )}
              </span>
              <span
                className="text-[12px]"
                style={{ opacity: i === highlight ? 0.9 : 0.6 }}
              >
                그때 {ageLabel(year)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[11.5px] leading-snug text-[#7a8ba0]">
        ※ 나이는 그 시절 그대로 <b>세는나이</b>예요 — 2023년 6월 28일 &lsquo;만
        나이 통일법&rsquo; 시행 전까지 우리가 쓰던 그 나이요.
      </p>
    </div>
  );
}
