"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Window from "@/components/Window";
import PartnerCta from "@/components/PartnerCta";
import { MEMORIES } from "@/data/memories";
import { koreanAgeInYear } from "@/lib/age";

/**
 * "너네 어떤 핸드폰 썼어?" — 연도별 대표 폰을 인스타 캐러셀처럼 옆으로 넘겨보는 영역.
 * 슬라이드 데이터는 별도 관리하지 않고 MEMORIES의 연도별 device 카드에서 파생한다
 * (카드 이미지가 교체되면 캐러셀에도 자동 반영).
 * 같은 해에 카드가 여럿이면 첫 device 카드를 쓴다 (연도별 대표 기기 순서).
 */
const PHONE_SLIDES = (() => {
  const byYear = new Map<
    number,
    { year: number; title: string; subtitle?: string; image: string }
  >();
  for (const m of MEMORIES) {
    if (m.category !== "device" || !m.image || byYear.has(m.year)) continue;
    if (!m.image.startsWith("/images")) continue;
    byYear.set(m.year, {
      year: m.year,
      title: m.title,
      subtitle: m.subtitle,
      image: m.image,
    });
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
})();

export default function PhoneCarousel({ born }: { born: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 폰 슬라이드 + 마지막 얼짱캠 CTA 슬라이드
  const totalSlides = PHONE_SLIDES.length + 1;

  const slideTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(idx, totalSlides - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((el, i) => {
      const c = el as HTMLElement;
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  if (PHONE_SLIDES.length === 0) return null;

  return (
    <Window title="그때그폰.exe" className="pop-in">
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <h2 className="font-pixel text-[20px] leading-snug">
            📱 너네 어떤 핸드폰 썼어?
          </h2>
          <p className="text-[12.5px] text-[#5a6b80] mt-1">
            옆으로 넘기면서 내 첫 폰을 찾아보세요
          </p>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
          aria-label="연도별 휴대폰 캐러셀"
        >
          {PHONE_SLIDES.map((s, i) => {
            const age = koreanAgeInYear(born, s.year);
            return (
              <Link
                key={s.year}
                href={`/year/${s.year}`}
                className="snap-center shrink-0 w-[88%] flex flex-col gap-2"
                aria-label={`${s.year}년 ${s.title}`}
              >
                {/* contain + 흰 배경: 사진 비율과 무관하게 기기 전체가 잘리지 않고 보인다 */}
                <div className="photo-frame" style={{ background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <span className="datestamp">{s.year}</span>
                </div>
                <div className="text-center">
                  <p className="font-pixel text-[16px] leading-tight">
                    {s.title}
                  </p>
                  <p className="text-[12px] text-[#7a8ba0] mt-0.5 truncate">
                    {s.subtitle}
                    {age >= 1 ? ` · 그때 나 ${age}살` : ""}
                  </p>
                </div>
              </Link>
            );
          })}

          {/* 마지막 슬라이드: 얼짱캠 CTA — 폰 추억이 최고조일 때 "그때 화질로 찍기" 제안 */}
          <div className="snap-center shrink-0 w-[88%] flex flex-col gap-2">
            <div className="photo-frame" style={{ background: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/years/2005/photo/uljjang-angle.jpg"
                alt="얼짱캠 2003 미리보기"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="datestamp">지금</span>
            </div>
            <div className="text-center">
              <p className="font-pixel text-[16px] leading-tight">
                그때 그 폰 화질로, 지금 네 얼굴 찍어볼래?
              </p>
            </div>
            <PartnerCta
              app="uljjangcam"
              label="📸 얼짱캠 2003 설치하기"
              note="원조 뽀샤시 · 흑백캠 · 얼짱각도 45° — 방금 본 그 폰들의 화질 그대로."
              campaign="phone-carousel"
              wide
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="pixel-btn secondary !w-auto !px-3 !py-1.5 !text-[13px]"
            onClick={() => slideTo(active - 1)}
            aria-label="이전 폰"
          >
            ◀
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {PHONE_SLIDES.map((s, i) => (
              <span
                key={s.year}
                className="w-2 h-2 rounded-full border border-[#1d2733]"
                style={{
                  background: i === active ? "#1d2733" : "transparent",
                }}
              />
            ))}
            {/* 마지막 CTA 슬라이드 도트 — 색을 달리해 "한 장 더" 힌트 */}
            <span
              className="w-2 h-2 rounded-full border border-[#1d2733]"
              style={{
                background: active === PHONE_SLIDES.length ? "#fee500" : "#fff3b8",
              }}
            />
          </div>
          <button
            type="button"
            className="pixel-btn secondary !w-auto !px-3 !py-1.5 !text-[13px]"
            onClick={() => slideTo(active + 1)}
            aria-label="다음 폰"
          >
            ▶
          </button>
        </div>
      </div>
    </Window>
  );
}
