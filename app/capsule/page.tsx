"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Window from "@/components/Window";
import CapsuleForm from "@/components/CapsuleForm";
import { decodeInvite, encodeCapsule, type CapsuleInvite } from "@/lib/capsule";
import { loadMyName, saveMyName } from "@/lib/age";
import { nameIga } from "@/lib/josa";

function CapsuleInviteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invite, setInvite] = useState<CapsuleInvite | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [started, setStarted] = useState(false);
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    const d = searchParams.get("d");
    const decoded = d ? decodeInvite(d) : null;
    if (decoded) {
      setInvite(decoded);
    } else {
      setInvalid(true);
    }
    setInitialName(loadMyName());
  }, [searchParams]);

  if (invalid) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">
          링크가 잘못됐어요 😢
          <br />
          친구에게 다시 받아보세요
        </p>
        <Link href="/" className="pixel-btn secondary">
          내 학창시절 보러가기
        </Link>
      </main>
    );
  }

  if (!invite) return null;

  function handleSubmit(name: string, answers: string[]) {
    if (!invite) return;
    saveMyName(name);
    const d = encodeCapsule({
      v: 1,
      kind: "result",
      year: invite.year,
      a: { name: invite.from, answers: invite.answers },
      b: { name, answers },
    });
    router.push(`/capsule/result?d=${d}`);
  }

  if (!started) {
    return (
      <main className="page flex flex-col justify-center gap-5">
        <header className="text-center pop-in">
          <p className="badge">💌 새 쪽지 1통</p>
          <h1 className="font-pixel text-[24px] mt-3 leading-snug">
            {nameIga(invite.from)}
            <br />
            {invite.year}년에서 타임캡슐을 보냈어요
          </h1>
        </header>

        <Window title="타임캡슐.exe" className="pop-in">
          <div className="flex flex-col gap-3 text-center">
            <p className="font-pixel text-[20px]">우리 그때 어땠지?</p>
            <p className="text-[13.5px] text-[#5a6b80] leading-relaxed">
              {invite.from}님은 이미 5개의 질문에 답했어요.
              <br />
              <b>당신이 답을 다 쓰기 전까지는 볼 수 없어요.</b>
              <br />
              둘 다 완료하면 두 사람의 {invite.year} 타임캡슐이 완성돼요.
            </p>
            <button
              type="button"
              className="pixel-btn primary"
              onClick={() => setStarted(true)}
            >
              ✏️ 나도 답하러 가기
            </button>
            <Link href={`/year/${invite.year}`} className="pixel-btn secondary">
              먼저 {invite.year}년 추억 구경하기
            </Link>
          </div>
        </Window>
      </main>
    );
  }

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in pt-2">
        <p className="badge">🕰️ {invite.year}년 타임캡슐</p>
        <h1 className="font-pixel text-[24px] mt-3 leading-snug">
          {invite.from} × 나의 기억
        </h1>
        <p className="text-[13.5px] text-[#5a6b80] mt-1.5">
          다 쓰면 {invite.from}님의 답과 나란히 공개돼요.
        </p>
      </header>

      <Window title="타임캡슐.exe — 네 차례" className="pop-in">
        <CapsuleForm
          initialName={initialName}
          nameLabel="친구가 알아볼 내 이름"
          submitLabel="🔓 타임캡슐 열기"
          onSubmit={handleSubmit}
        />
      </Window>
    </main>
  );
}

export default function CapsuleInvitePage() {
  return (
    <Suspense>
      <CapsuleInviteInner />
    </Suspense>
  );
}
