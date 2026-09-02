"use client";

import { useState } from "react";
import { loadMyName, saveMyName } from "@/lib/age";
import { REGIONS } from "@/lib/regions";
import { STICKERS } from "@/lib/stickers";
import Sticker from "@/components/Sticker";

type Comment = {
  name: string;
  text: string;
  ts: number;
  region?: string;
  sticker?: string;
  id?: string;
  hearts?: number;
};

function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 미니홈피 방명록 감성의 카드 댓글.
 * prompt(카드의 질문)를 넘기면 입력칸·빈 상태가 그 질문에 바로 답하는 흐름이 된다
 * — "포지션 뭐였어요?" 같은 구체적 질문이 일반 문구보다 참여를 훨씬 잘 끌어낸다. */
export default function CommentBox({
  cardId,
  prompt,
}: {
  cardId: string;
  prompt?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [text, setText] = useState("");
  const [sticker, setSticker] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [hearted, setHearted] = useState<Set<string>>(new Set());

  function loadHearted() {
    try {
      return new Set<string>(
        JSON.parse(localStorage.getItem("memory.hearts") ?? "[]"),
      );
    } catch {
      return new Set<string>();
    }
  }

  async function heart(c: Comment) {
    if (!c.id || hearted.has(c.id)) return;
    const next = new Set(hearted).add(c.id);
    setHearted(next);
    try {
      localStorage.setItem("memory.hearts", JSON.stringify([...next]));
    } catch {}
    setComments((prev) =>
      (prev ?? []).map((x) =>
        x.id === c.id ? { ...x, hearts: (x.hearts ?? 0) + 1 } : x,
      ),
    );
    try {
      await fetch("/api/hearts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardId, id: c.id }),
      });
    } catch {}
  }

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/comments?card=${encodeURIComponent(cardId)}`);
      const d = await r.json();
      setComments(d.comments ?? []);
      setCount(d.count ?? 0);
    } catch {
      setComments([]);
    }
    setLoading(false);
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && comments === null) {
      setName(loadMyName());
      setHearted(loadHearted());
      try {
        setRegion(localStorage.getItem("memory.region") ?? "");
      } catch {}
      load();
    }
  }

  async function submit() {
    const n = name.trim();
    const t = text.trim();
    if (!n || (!t && !sticker) || sending) return;
    setSending(true);
    saveMyName(n);
    try {
      localStorage.setItem("memory.region", region);
    } catch {}
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card: cardId,
          name: n,
          text: t,
          region,
          ...(sticker ? { sticker } : {}),
        }),
      });
      const d = await r.json();
      if (d.ok && d.comment) {
        setComments((prev) => [d.comment, ...(prev ?? [])]);
        setCount((c) => (c ?? 0) + 1);
        setText("");
        setSticker(null);
        setPickerOpen(false);
      }
    } catch {}
    setSending(false);
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={toggle}
        className="font-pixel text-[13px] text-[#2f6fce] underline decoration-dotted -webkit-tap-highlight-color-transparent"
      >
        💬 {prompt ? "바로 답 남기기" : "한마디"}{" "}
        {count !== null ? `(${count})` : ""} {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="mt-2 border-2 border-[#1d2733] rounded-lg bg-[#f4f9ff] p-3 flex flex-col gap-2.5">
          <form
            className="flex flex-col gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flex gap-1.5">
              <input
                className="pixel-input !py-2 !text-[14px] !w-[80px] shrink-0"
                placeholder="이름"
                maxLength={12}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select
                className="pixel-input !py-2 !text-[13px] !w-[76px] shrink-0 !px-1.5"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="지역"
              >
                <option value="">지역</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                className="pixel-input !py-2 !text-[14px] flex-1 min-w-0"
                placeholder={prompt ?? "이 추억에 한마디..."}
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            {/* 그 시절 스티커 픽커 */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className="font-pixel text-[12px] text-[#2f6fce] underline decoration-dotted"
                onClick={() => setPickerOpen((o) => !o)}
              >
                🎟 스티커 {pickerOpen ? "접기" : "붙이기"}
              </button>
              {sticker && (
                <button
                  type="button"
                  onClick={() => setSticker(null)}
                  aria-label="선택한 스티커 제거"
                  title="눌러서 제거"
                >
                  <Sticker id={sticker} size="sm" />
                </button>
              )}
            </div>
            {pickerOpen && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-[#c9d8ec] rounded-lg">
                {STICKERS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSticker(st.id);
                      setPickerOpen(false);
                    }}
                    className={sticker === st.id ? "ring-2 ring-[#2f6fce] rounded-md" : ""}
                    aria-label={`스티커 ${st.label}`}
                  >
                    <Sticker id={st.id} size="sm" />
                  </button>
                ))}
              </div>
            )}
            {/* 허니팟 */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <button
              type="submit"
              className="pixel-btn blue !w-auto self-end !px-4 !py-1.5 !text-[13px]"
              disabled={sending || !name.trim() || (!text.trim() && !sticker)}
            >
              {sending ? "남기는 중..." : "✏️ 남기기"}
            </button>
          </form>

          {loading ? (
            <p className="font-pixel text-[12px] text-[#7a8ba0] text-center py-1">
              불러오는 중...
            </p>
          ) : comments && comments.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {comments.map((c, i) => (
                <li
                  key={c.id ?? `${c.ts}-${i}`}
                  className="bg-white border border-[#c9d8ec] rounded-lg px-2.5 py-1.5"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="font-pixel text-[12.5px] text-[#2f6fce]">
                        {c.name}
                        {c.region ? ` (${c.region})` : ""}
                      </span>
                      <span className="text-[10.5px] text-[#a3b2c4] ml-1.5">
                        {fmt(c.ts)}
                      </span>
                      {c.text && (
                        <p className="text-[13.5px] leading-snug mt-0.5 break-words">
                          {c.text}
                        </p>
                      )}
                      {c.sticker && (
                        <p className="mt-1">
                          <Sticker id={c.sticker} size="sm" />
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => heart(c)}
                      disabled={!c.id || hearted.has(c.id)}
                      className="shrink-0 font-pixel text-[12px] text-[#e84d8a] px-1.5 py-0.5 disabled:opacity-70"
                      aria-label="하트"
                    >
                      {c.id && hearted.has(c.id) ? "❤️" : "🤍"}{" "}
                      {c.hearts ?? 0}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-pixel text-[12px] text-[#7a8ba0] text-center py-1">
              {prompt
                ? `"${prompt}" — 첫 답의 주인공이 되어보세요!`
                : "아직 아무도 안 남겼어요. 첫 한마디의 주인공이 되어보세요!"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
