"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import CapsuleForm from "@/components/CapsuleForm";
import ShareButton from "@/components/ShareButton";
import { encodeCapsule } from "@/lib/capsule";
import { loadMyName, saveMyName } from "@/lib/age";
import { AVAILABLE_YEARS } from "@/data/memories";

const SHARE_TEXT = "야 이거 보자마자 너 생각남ㅋㅋ\n우리 이때 진짜 많이 했잖아";

function CapsuleNewInner() {
  const searchParams = useSearchParams();
  const year = parseInt(searchParams.get("year") ?? "", 10);
  const [initialName, setInitialName] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [fromName, setFromName] = useState("");

  useEffect(() => {
    setInitialName(loadMyName());
  }, []);

  if (!AVAILABLE_YEARS.includes(year)) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">연도 정보가 없어요 🚧</p>
        <Link href="/timeline" className="pixel-btn secondary">
          연도 선택으로
        </Link>
      </main>
    );
  }

  function handleSubmit(name: string, answers: string[]) {
    saveMyName(name);
    setFromName(name);
    const d = encodeCapsule({ v: 2, kind: "invite", year, from: name, answers });
    setInviteUrl(`${window.location.origin}/capsule?d=${d}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (inviteUrl) {
    return (
      <main className="page flex flex-col justify-center gap-5">
        <header className="text-center pop-in">
          <p className="badge">💌 타임캡슐 준비 완료</p>
          <h1 className="font-pixel text-[24px] mt-3 leading-snug">
            이제 그 친구에게
            <br />
            보내기만 하면 돼요
          </h1>
        </header>

        <Window title="쪽지 미리보기" className="pop-in">
          <div className="flex flex-col gap-3">
            <p className="speech whitespace-pre-line">{SHARE_TEXT}</p>
            <p className="text-[13px] text-[#5a6b80]">
              친구가 링크로 들어와서 답을 쓰면, 두 사람의 {year} 타임캡슐이
              완성돼요. {fromName}님의 답은 친구가 답을 다 쓰기 전까지 보이지
              않아요.
            </p>
            <ShareButton
              label="💌 그 친구에게 보내기"
              text={SHARE_TEXT}
              url={inviteUrl}
            />
            <Link href={`/year/${year}`} className="pixel-btn secondary">
              {year}년으로 돌아가기
            </Link>
          </div>
        </Window>
      </main>
    );
  }

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in pt-2">
        <p className="badge">🕰️ {year}년 타임캡슐</p>
        <h1 className="font-pixel text-[24px] mt-3 leading-snug">
          우리 그때 어땠지?
        </h1>
        <p className="text-[13.5px] text-[#5a6b80] mt-1.5">
          먼저 당신의 기억을 적어주세요.
          <br />
          친구도 답을 쓰면 서로의 답이 공개돼요.
        </p>
      </header>

      <Window title="타임캡슐.exe — 내 차례" className="pop-in">
        <CapsuleForm
          initialName={initialName}
          nameLabel="친구가 알아볼 내 이름"
          submitLabel="📦 타임캡슐에 넣기"
          onSubmit={handleSubmit}
        />
      </Window>

      <Link
        href={`/year/${year}`}
        className="text-center text-[13px] text-[#5a6b80] font-pixel"
      >
        ← {year}년으로 돌아가기
      </Link>
    </main>
  );
}

export default function CapsuleNewPage() {
  return (
    <Suspense>
      <CapsuleNewInner />
    </Suspense>
  );
}
