"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import BgmPlayer from "@/components/BgmPlayer";
import { getYearInfo } from "@/data/memories";
import { CAPSULE_QUESTIONS } from "@/data/capsuleQuestions";
import { decodeResult, type CapsuleResult } from "@/lib/capsule";
import { fillLabel } from "@/lib/josa";

function AnswerBlock({ label, answer }: { label: string; answer: string }) {
  return (
    <div>
      <p className="font-pixel text-[13px] text-[#5a6b80]">💬 {label}</p>
      <p className="speech mt-2">&ldquo;{answer}&rdquo;</p>
    </div>
  );
}

function CapsuleResultInner() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<CapsuleResult | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  useEffect(() => {
    const d = searchParams.get("d");
    const decoded = d ? decodeResult(d) : null;
    if (decoded) {
      setResult(decoded);
      setResultUrl(window.location.href);
    } else {
      setInvalid(true);
    }
  }, [searchParams]);

  if (invalid) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">결과 링크가 잘못됐어요 😢</p>
        <Link href="/" className="pixel-btn secondary">
          처음으로
        </Link>
      </main>
    );
  }

  if (!result) return null;

  const { year, a, b } = result;
  const info = getYearInfo(year);
  const shareText = `우리 ${year} 타임캡슐 완성됐다ㅋㅋ\n네 답이랑 내 답이랑 같이 들어있음. 이거 봐봐`;

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in pt-4">
        <p className="badge">📦 타임캡슐 개봉</p>
        <h1 className="font-pixel text-[30px] mt-3 leading-snug">
          {a.name} × {b.name}
          <br />의 {year}
        </h1>
      </header>

      {info?.image && (
        <div className="window pop-in">
          <div className="window-titlebar !py-1.5">
            <span aria-hidden>📼</span>
            <span className="text-[13px]">{year}년의 우리</span>
            <span className="win-buttons" aria-hidden>
              <span className="win-btn">–</span>
              <span className="win-btn close">×</span>
            </span>
          </div>
          <div className="p-3">
            <div
              className="photo-frame"
              style={{ background: "linear-gradient(135deg, #cfe9fb, #ffd6e8)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={info.image}
                alt={`${year}년의 풍경`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="datestamp">{year}</span>
            </div>
          </div>
        </div>
      )}

      {info?.song && (
        <div className="pop-in">
          <BgmPlayer song={info.song} />
        </div>
      )}

      {CAPSULE_QUESTIONS.map((q, i) => (
        <article
          key={q.id}
          className="window card-appear"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="window-titlebar">
            <span aria-hidden>{q.emoji}</span>
            <span>
              Q{i + 1}. {q.text}
            </span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <AnswerBlock
              label={fillLabel(q.resultLabel, a.name)}
              answer={a.answers[i] ?? "-"}
            />
            <AnswerBlock
              label={fillLabel(q.resultLabel, b.name)}
              answer={b.answers[i] ?? "-"}
            />
          </div>
        </article>
      ))}

      <div className="window pop-in">
        <div className="window-titlebar">
          <span aria-hidden>🎉</span>
          <span>완성!</span>
        </div>
        <div className="p-4 flex flex-col gap-3 text-center">
          <p className="font-pixel text-[19px] leading-snug">
            우리의 {year} 타임캡슐이
            <br />
            완성됐어요.
          </p>
          <p className="text-[13px] text-[#5a6b80]">
            이 링크를 저장해두면 언제든 다시 열어볼 수 있어요.
            <br />
            {a.name}님에게도 결과를 보내주세요!
          </p>
          <ShareButton
            label="📦 이 타임캡슐 공유하기"
            text={shareText}
            url={resultUrl}
          />
          <Link href={`/year/${year}`} className="pixel-btn secondary">
            나도 {year}년 추억 보러가기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CapsuleResultPage() {
  return (
    <Suspense>
      <CapsuleResultInner />
    </Suspense>
  );
}
