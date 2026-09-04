"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Window from "@/components/Window";
import { AVAILABLE_YEARS } from "@/data/memories";
import { loadMyName, saveMyName } from "@/lib/age";

type Item = {
  id: string;
  name: string;
  year?: number;
  text: string;
  ts: number;
  hasImage: boolean;
};

function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function JeboClient() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [contact, setContact] = useState("");
  const [agree, setAgree] = useState(false);
  const [fileName, setFileName] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(loadMyName());
    fetch("/api/jebo")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setCount(d.count ?? 0);
      })
      .catch(() => setItems([]));
  }, []);

  const hasFile = Boolean(fileName);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || text.trim().length < 5) {
      setError("닉네임과 설명(5자 이상)을 입력해주세요.");
      return;
    }
    if (hasFile && !agree) {
      setError("사진을 보내시려면 권리 확인에 동의해주세요.");
      return;
    }
    setSending(true);
    saveMyName(name.trim());
    try {
      const fd = new FormData(formRef.current!);
      fd.set("agree", agree ? "1" : "0");
      const r = await fetch("/api/jebo", { method: "POST", body: fd });
      const d = await r.json();
      if (d.ok && d.item) {
        setItems((prev) => [d.item, ...(prev ?? [])]);
        setCount((c) => (c ?? 0) + 1);
        setText("");
        setContact("");
        setFileName("");
        setAgree(false);
        if (fileRef.current) fileRef.current.value = "";
        setDone(true);
        setTimeout(() => setDone(false), 4000);
      } else {
        setError("전송에 실패했어요. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setError("전송에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
    setSending(false);
  }

  return (
    <main className="page flex flex-col gap-5">
      <header className="text-center pop-in">
        <p className="badge">📮 추억 제보함</p>
        <h1 className="font-pixel text-[24px] mt-3 leading-snug">
          그때 그 사진,
          <br />
          저희가 올려드릴게요
        </h1>
        <p className="text-[13px] text-[#5a6b80] mt-2 leading-relaxed">
          서랍 속 사진이나 물건이 있다면 알려주세요.
          <br />
          확인 후 카드로 만들어 올려드립니다.
        </p>
      </header>

      <Window title="제보하기.exe" className="pop-in">
        <form ref={formRef} onSubmit={submit} className="flex flex-col gap-2.5">
          <div className="flex gap-1.5">
            <input
              name="name"
              className="pixel-input !py-2 !text-[14px] !w-[100px] shrink-0"
              placeholder="닉네임"
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              name="year"
              className="pixel-input !py-2 !text-[13px] flex-1 !px-2"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="연도"
            >
              <option value="">몇 년도 추억인가요?</option>
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="text"
            className="pixel-input !py-2 !text-[14px] min-h-[84px]"
            placeholder="어떤 사진·물건인가요? (예: 2003년 문방구에서 산 팽이 실물 사진 있어요)"
            maxLength={300}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            name="contact"
            className="pixel-input !py-2 !text-[14px]"
            placeholder="연락받을 곳 (선택 · 이메일이나 인스타 아이디)"
            maxLength={80}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 p-2.5 bg-white border border-[#c9d8ec] rounded-lg">
            <label className="font-pixel text-[13px] cursor-pointer">
              📎 사진 첨부 (선택)
              <input
                ref={fileRef}
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block mt-1.5 text-[12px] w-full"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
            <p className="text-[11px] text-[#7a8ba0] leading-snug">
              보내주신 사진은 <b>공개되지 않아요.</b> 운영자만 확인한 뒤, 카드에
              쓰게 되면 미리 알려드립니다.
            </p>
            {hasFile && (
              <label className="flex items-start gap-1.5 text-[11.5px] leading-snug cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  직접 찍었거나 사용할 권리가 있는 사진이며, 사진 속 인물의 동의를
                  받았습니다.
                </span>
              </label>
            )}
          </div>

          {/* 허니팟 */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          {error && (
            <p className="text-[12.5px] text-[#d42a2a] font-pixel">{error}</p>
          )}
          {done && (
            <p className="text-[12.5px] text-[#1d7a3a] font-pixel">
              ✅ 보내주셔서 고마워요! 확인하고 연락드릴게요.
            </p>
          )}

          <button
            type="submit"
            className="pixel-btn blue !py-2.5 !text-[14px]"
            disabled={sending}
          >
            {sending ? "보내는 중..." : "📮 제보 보내기"}
          </button>
        </form>
      </Window>

      <Window
        title={`제보함 (${count ?? 0})`}
        className="pop-in"
      >
        {items === null ? (
          <p className="font-pixel text-[12px] text-[#7a8ba0] text-center py-2">
            불러오는 중...
          </p>
        ) : items.length === 0 ? (
          <p className="font-pixel text-[12.5px] text-[#7a8ba0] text-center py-2">
            아직 제보가 없어요. 첫 제보의 주인공이 되어보세요!
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {items.map((it) => (
              <li
                key={it.id}
                className="bg-white border border-[#c9d8ec] rounded-lg px-2.5 py-2"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-pixel text-[12.5px] text-[#2f6fce]">
                    {it.name}
                  </span>
                  {it.year && (
                    <span className="badge !text-[10.5px] !px-1.5 !py-0.5">
                      {it.year}년
                    </span>
                  )}
                  {it.hasImage && (
                    <span className="text-[10.5px] text-[#1d7a3a]">📎 사진 첨부</span>
                  )}
                  <span className="text-[10.5px] text-[#a3b2c4] ml-auto">
                    {fmt(it.ts)}
                  </span>
                </div>
                <p className="text-[13.5px] leading-snug mt-1 break-words">
                  {it.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Window>

      <Link
        href="/timeline"
        className="text-center text-[13px] text-[#5a6b80] font-pixel"
      >
        ← 타임라인으로
      </Link>
    </main>
  );
}
