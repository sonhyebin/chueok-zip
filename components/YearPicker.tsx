"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AVAILABLE_YEARS, FEATURED_YEAR } from "@/data/memories";
import { ageInYear } from "@/lib/age";

/**
 * 옛날 윈도우 "실행" 대화상자풍 연도 선택 콤보박스.
 * - ▼ 를 누르면 목록이 펼쳐지고, 칸에 숫자를 치면 연도가 필터링된다 (98 → 1998).
 * - 연도가 늘어나도 세로로 길어지지 않도록 긴 그리드를 대체한다.
 */
export default function YearPicker({ born }: { born: number }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const years = useMemo(
    () =>
      query.trim()
        ? AVAILABLE_YEARS.filter((y) => String(y).includes(query.trim()))
        : AVAILABLE_YEARS,
    [query],
  );

  const go = (year: number) => {
    setOpen(false);
    router.push(`/year/${year}`);
  };

  const ageLabel = (year: number) => {
    const age = ageInYear(born, year);
    return age >= 1 ? `${age}살` : "태어나기 전";
  };

  const sunken: React.CSSProperties = {
    background: "var(--paper)",
    border: "2px solid var(--ink)",
    boxShadow: "inset 2px 2px 0 rgba(29,39,51,0.25)",
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <p className="font-pixel text-[14px] mb-1.5">
        열기(<span className="underline">O</span>): 돌아갈 연도를 고르세요
      </p>

      <div className="flex items-stretch" style={sunken}>
        <input
          type="text"
          inputMode="numeric"
          role="combobox"
          aria-expanded={open}
          aria-controls="year-picker-list"
          aria-label="연도 검색"
          placeholder={`예: ${FEATURED_YEAR}`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.replace(/[^0-9]/g, ""));
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => Math.min(h + 1, years.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter") {
              const y = years[highlight] ?? years[0];
              if (y) go(y);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="flex-1 min-w-0 px-3 py-2.5 font-pixel text-[17px] outline-none bg-transparent"
        />
        <button
          type="button"
          aria-label={open ? "목록 닫기" : "연도 목록 열기"}
          onClick={() => setOpen((o) => !o)}
          className="px-3 font-pixel text-[13px] shrink-0"
          style={{
            background: "var(--sky-200)",
            borderLeft: "2px solid var(--ink)",
          }}
        >
          {open ? "▲" : "▼"}
        </button>
      </div>

      {open && (
        <ul
          id="year-picker-list"
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1 max-h-[264px] overflow-y-auto"
          style={{
            ...sunken,
            boxShadow: "3px 3px 0 var(--shadow)",
          }}
        >
          {years.length === 0 && (
            <li className="px-3 py-2.5 text-[13px] text-[#7a8ba0]">
              그런 연도는 없어요 (1998~2016)
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
                  {ageLabel(year)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => go(FEATURED_YEAR)}
        className="pixel-btn blue w-full mt-3 !py-2.5 !text-[14px]"
      >
        ★ 추천: {FEATURED_YEAR}년으로 바로가기 ({ageLabel(FEATURED_YEAR)})
      </button>
    </div>
  );
}
