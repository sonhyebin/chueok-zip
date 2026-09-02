"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import StoryShareButton from "@/components/StoryShareButton";
import PartnerCta from "@/components/PartnerCta";
import BgmPlayer from "@/components/BgmPlayer";
import { getYearInfo } from "@/data/memories";
import {
  CAPSULE_QUESTIONS,
  LEGACY_CAPSULE_QUESTIONS,
} from "@/data/capsuleQuestions";
import {
  isCapsuleRecord,
  type CapsuleRecord,
  type CapsuleResult,
} from "@/lib/capsule";
import { decryptCapsule, getCapsuleKeyFromHash } from "@/lib/capsuleCrypto";
import { fillLabel } from "@/lib/josa";
import { trackEvent } from "@/lib/analytics";

function AnswerBlock({ label, answer }: { label: string; answer: string }) {
  return (
    <div>
      <p className="font-pixel text-[13px] text-[#5a6b80]">💬 {label}</p>
      <p className="speech mt-2">&ldquo;{answer}&rdquo;</p>
    </div>
  );
}

export default function CapsuleResultClient({
  capsuleId,
  record,
  legacyResult,
}: {
  capsuleId: string;
  record: CapsuleRecord | null;
  legacyResult: CapsuleResult | null;
}) {
  const [result, setResult] = useState<CapsuleResult | null>(legacyResult);
  const [invalid, setInvalid] = useState(!record && !legacyResult);
  const [resultUrl, setResultUrl] = useState("");

  useEffect(() => {
    setResultUrl(window.location.href);
    if (legacyResult) return;
    if (!record || !capsuleId) {
      setInvalid(true);
      return;
    }
    const initialRecord = record;
    const key = getCapsuleKeyFromHash();
    if (!key) {
      setInvalid(true);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function resolveResult() {
      let candidate: CapsuleRecord = initialRecord;
      for (let attempt = 0; attempt < 10 && active; attempt++) {
        if (candidate.kind === "result") {
          const value = await decryptCapsule(candidate.cipher, key);
          if (
            value?.kind === "result" &&
            value.year === candidate.year &&
            value.a.name === candidate.aName &&
            value.b.name === candidate.bName
          ) {
            setResult(value);
            return;
          }
        }

        await new Promise((resolve) => window.setTimeout(resolve, 500));
        try {
          const response = await fetch(`/api/capsules/${capsuleId}`, {
            cache: "no-store",
            signal: controller.signal,
          });
          const latest: unknown = response.ok ? await response.json() : null;
          if (isCapsuleRecord(latest)) candidate = latest;
        } catch {
          if (controller.signal.aborted) return;
        }
      }
      if (active) setInvalid(true);
    }

    void resolveResult();
    return () => {
      active = false;
      controller.abort();
    };
  }, [capsuleId, legacyResult, record]);

  if (invalid) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">
          결과 링크가 잘못됐거나 암호키가 빠졌어요 😢
        </p>
        <Link href="/" className="pixel-btn secondary">
          처음으로
        </Link>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">📦 타임캡슐 여는 중...</p>
      </main>
    );
  }

  const { year, a, b } = result;
  const info = getYearInfo(year);
  const questions =
    result.v === 1 ? LEGACY_CAPSULE_QUESTIONS : CAPSULE_QUESTIONS;
  const shareText = `${a.name} × ${b.name}의 ${year} 타임캡슐 완성ㅋㅋ\n첫인상부터 웃긴 사건까지 답이 나란히 열렸어. 이거 봐봐`;
  const storyEndpoint = capsuleId
    ? `/api/story?c=${capsuleId}`
    : `/api/story?year=${year}&a=${encodeURIComponent(a.name)}&b=${encodeURIComponent(b.name)}`;

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in pt-4">
        <p className="badge">📦 타임캡슐 개봉</p>
        <h1 className="font-pixel text-[30px] mt-3 leading-snug">
          {a.name} × {b.name}
          <br />
          {year}년의 우리
        </h1>
      </header>

      {info?.image ? (
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
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span className="datestamp">{year}</span>
            </div>
          </div>
        </div>
      ) : null}

      {info?.song ? (
        <div className="pop-in">
          <BgmPlayer song={info.song} />
        </div>
      ) : null}

      {questions.map((question, index) => (
        <article
          key={question.id}
          className="window card-appear"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="window-titlebar">
            <span aria-hidden>{question.emoji}</span>
            <span>
              Q{index + 1}. {question.text}
            </span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <AnswerBlock
              label={fillLabel(question.resultLabel, a.name)}
              answer={a.answers[index] ?? "-"}
            />
            <AnswerBlock
              label={fillLabel(question.resultLabel, b.name)}
              answer={b.answers[index] ?? "-"}
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
            {a.name}님에게 결과를 보내고,
            <br />
            이번에는 다른 친구의 기억도 열어보세요.
          </p>
          <ShareButton
            label={`📦 ${a.name}에게 결과 보내기`}
            title={`${a.name} × ${b.name}의 ${year} 타임캡슐`}
            text={shareText}
            url={resultUrl}
            eventName="result_share"
            eventProperties={{ year, source: "result" }}
          />
          <StoryShareButton
            endpoint={storyEndpoint}
            filename={`chueok-${year}-${a.name}-${b.name}.png`}
            shareText={shareText}
            year={year}
          />
          <Link
            href={`/capsule/new?year=${year}`}
            className="pixel-btn blue"
            onClick={() => trackEvent("chain_start", { year, source: "result" })}
          >
            💌 다른 친구와 {year}년 열어보기
          </Link>
          <Link href={`/year/${year}`} className="pixel-btn secondary">
            📼 {year}년 추억 더 보기
          </Link>
        </div>
      </div>

      {/* 공유·체인 버튼 뒤에 둔다 — 바이럴 루프가 먼저고, 앱은 그다음 */}
      <div className="window pop-in">
        <div className="window-titlebar">
          <span aria-hidden>📸</span>
          <span>그때 그 얼굴로</span>
        </div>
        <div className="p-4">
          <PartnerCta
            app="uljjangcam"
            label="📸 그 화질로 한 장 찍기"
            note={`기억만 꺼내고 끝내기 아쉽다면, ${year}년 그 화질로 지금 얼굴을 한 장 남겨보세요.`}
            campaign={`capsule-result-${year}`}
            wide
          />
        </div>
      </div>
    </main>
  );
}
