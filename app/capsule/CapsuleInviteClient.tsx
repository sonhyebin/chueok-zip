"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Window from "@/components/Window";
import CapsuleForm from "@/components/CapsuleForm";
import {
  CAPSULE_QUESTIONS,
  LEGACY_CAPSULE_QUESTIONS,
} from "@/data/capsuleQuestions";
import {
  encodeCapsule,
  type CapsuleInvite,
  type CapsuleRecord,
  type CapsuleResult,
} from "@/lib/capsule";
import {
  decryptCapsule,
  createCapsuleUpdateProof,
  encryptCapsule,
  getCapsuleKeyFromHash,
} from "@/lib/capsuleCrypto";
import { loadMyName, saveMyName } from "@/lib/age";
import { nameIga } from "@/lib/josa";
import { trackEvent } from "@/lib/analytics";

export default function CapsuleInviteClient({
  capsuleId,
  record,
  legacyInvite,
}: {
  capsuleId: string;
  record: CapsuleRecord | null;
  legacyInvite: CapsuleInvite | null;
}) {
  const router = useRouter();
  const [invite, setInvite] = useState<CapsuleInvite | null>(legacyInvite);
  const [invalid, setInvalid] = useState(!record && !legacyInvite);
  const [started, setStarted] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [error, setError] = useState("");
  const [capsuleKey, setCapsuleKey] = useState("");

  useEffect(() => {
    setInitialName(loadMyName());
    if (legacyInvite) {
      trackEvent("invite_open", { year: legacyInvite.year, version: "legacy" });
      return;
    }
    if (!record || !capsuleId) {
      setInvalid(true);
      return;
    }

    const key = getCapsuleKeyFromHash();
    if (!key) {
      setInvalid(true);
      return;
    }
    setCapsuleKey(key);
    if (record.kind === "result") {
      router.replace(`/capsule/result?c=${capsuleId}#k=${encodeURIComponent(key)}`);
      return;
    }

    let active = true;
    void decryptCapsule(record.cipher, key).then((value) => {
      if (!active) return;
      if (
        value?.kind === "invite" &&
        value.year === record.year &&
        value.from === record.fromName
      ) {
        setInvite(value);
        trackEvent("invite_open", { year: value.year, version: "short" });
      } else {
        setInvalid(true);
      }
    });
    return () => {
      active = false;
    };
  }, [capsuleId, legacyInvite, record, router]);

  if (invalid) {
    return (
      <main className="page flex flex-col justify-center gap-4 text-center">
        <p className="font-pixel text-[20px]">
          링크가 잘못됐거나 암호키가 빠졌어요 😢
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

  async function handleSubmit(name: string, answers: string[]) {
    if (!invite) return;
    setError("");
    saveMyName(name);
    const result: CapsuleResult = {
      v: invite.v,
      kind: "result",
      year: invite.year,
      a: { name: invite.from, answers: invite.answers },
      b: { name, answers },
    };

    if (record && capsuleId && capsuleKey) {
      try {
        const { cipher } = await encryptCapsule(result, capsuleKey);
        const completed: CapsuleRecord = {
          schema: 1,
          kind: "result",
          year: invite.year,
          aName: invite.from,
          bName: name,
          cipher,
          updateProofHash: record.updateProofHash,
          createdAt: record.createdAt,
        };
        const updateProof = await createCapsuleUpdateProof(capsuleKey);
        const response = await fetch(`/api/capsules/${capsuleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ record: completed, updateProof }),
        });
        if (!response.ok && response.status !== 409) {
          throw new Error("capsule update failed");
        }
        trackEvent("invite_completed", { year: invite.year, version: "short" });
        router.push(
          `/capsule/result?c=${capsuleId}#k=${encodeURIComponent(capsuleKey)}`,
        );
        return;
      } catch {
        setError("결과 저장에 실패했어요. 잠시 후 다시 눌러주세요.");
        return;
      }
    }

    const d = encodeCapsule(result);
    trackEvent("invite_completed", { year: invite.year, version: "legacy" });
    router.push(`/capsule/result?d=${d}`);
  }

  if (!started) {
    return (
      <main className="page flex flex-col justify-center gap-5">
        <header className="text-center pop-in">
          <p className="badge">💌 새 쪽지 1통</p>
          <h1 className="font-pixel text-[24px] mt-3 leading-snug break-keep">
            {nameIga(invite.from)} {invite.year}년에서
            <br />
            타임캡슐을 보냈어요
          </h1>
        </header>

        <Window title="타임캡슐.exe" className="pop-in">
          <div className="flex flex-col gap-3 text-center">
            <p className="font-pixel text-[20px]">
              첫 질문: 처음 봤을 때
              <br />
              솔직히 무슨 생각했어?
            </p>
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
              ✏️ 나도 답하고 {invite.from}의 답 보기
            </button>
            <Link href={`/year/${invite.year}`} className="pixel-btn secondary">
              먼저 {invite.year}년 추억 구경하기
            </Link>
          </div>
        </Window>
      </main>
    );
  }

  const questions =
    invite.v === 1 ? LEGACY_CAPSULE_QUESTIONS : CAPSULE_QUESTIONS;

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
          questions={questions}
          onSubmit={handleSubmit}
        />
        {error ? (
          <p className="text-center text-[13px] text-[#e84d8a] font-pixel mt-3">
            {error}
          </p>
        ) : null}
      </Window>
    </main>
  );
}
