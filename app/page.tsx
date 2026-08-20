"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import { SERVICE_NAME, SERVICE_TAGLINE } from "@/lib/config";
import {
  isValidBirthYear,
  loadBornYear,
  saveBornYear,
  MIN_BIRTH_YEAR,
  MAX_BIRTH_YEAR,
} from "@/lib/age";

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // 얼짱캠 등 외부에서 ?born=1992 로 진입하면 바로 타임라인으로
  useEffect(() => {
    const born = searchParams.get("born");
    if (born && isValidBirthYear(parseInt(born, 10))) {
      saveBornYear(parseInt(born, 10));
      router.replace(`/timeline?born=${born}`);
      return;
    }
    const saved = loadBornYear();
    if (saved) setValue(String(saved));
  }, [searchParams, router]);

  function submit() {
    const year = parseInt(value, 10);
    if (!isValidBirthYear(year)) {
      setError(`${MIN_BIRTH_YEAR}~${MAX_BIRTH_YEAR} 사이로 입력해주세요`);
      return;
    }
    saveBornYear(year);
    router.push(`/timeline?born=${year}`);
  }

  return (
    <main className="page flex flex-col justify-center gap-6">
      <div className="text-center pop-in">
        <p className="badge">📼 {SERVICE_TAGLINE}</p>
        <h1 className="font-pixel text-[44px] mt-3 leading-none tracking-tight">
          {SERVICE_NAME}
        </h1>
      </div>

      <Window title="시간여행.exe" className="pop-in">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="text-center">
            <h2 className="font-pixel text-[26px]">몇 년생이에요?</h2>
            <p className="text-[13.5px] text-[#5a6b80] mt-1">
              학창시절로 데려다줄게요. 회원가입 그런 거 없어요.
            </p>
          </div>

          <input
            className="pixel-input text-center font-pixel !text-[28px] tracking-[0.2em]"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1992"
            maxLength={4}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            aria-label="출생연도"
          />

          {error && (
            <p className="text-center text-[13px] text-[#e84d8a] font-pixel">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="pixel-btn primary"
            disabled={value.length !== 4}
          >
            🕰️ 내 학창시절로 돌아가기
          </button>
        </form>
      </Window>

      <p className="text-center text-[12px] text-[#7a8ba0] font-pixel blink">
        ▼ Enter를 눌러 접속하세요 ▼
      </p>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
