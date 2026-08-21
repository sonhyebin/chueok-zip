"use client";

import { useState } from "react";
import { loadMyName, saveMyName } from "@/lib/age";

type Comment = { name: string; text: string; ts: number };

function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 미니홈피 방명록 감성의 카드 댓글 */
export default function CommentBox({ cardId }: { cardId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

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
      load();
    }
  }

  async function submit() {
    const n = name.trim();
    const t = text.trim();
    if (!n || !t || sending) return;
    setSending(true);
    saveMyName(n);
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: cardId, name: n, text: t }),
      });
      const d = await r.json();
      if (d.ok && d.comment) {
        setComments((prev) => [d.comment, ...(prev ?? [])]);
        setCount((c) => (c ?? 0) + 1);
        setText("");
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
        💬 한마디 {count !== null ? `(${count})` : ""} {open ? "▲" : "▼"}
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
                className="pixel-input !py-2 !text-[14px] !w-[92px] shrink-0"
                placeholder="이름"
                maxLength={12}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="pixel-input !py-2 !text-[14px] flex-1 min-w-0"
                placeholder="이 추억에 한마디..."
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
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
            <button
              type="submit"
              className="pixel-btn blue !w-auto self-end !px-4 !py-1.5 !text-[13px]"
              disabled={sending || !name.trim() || !text.trim()}
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
                  key={`${c.ts}-${i}`}
                  className="bg-white border border-[#c9d8ec] rounded-lg px-2.5 py-1.5"
                >
                  <span className="font-pixel text-[12.5px] text-[#2f6fce]">
                    {c.name}
                  </span>
                  <span className="text-[10.5px] text-[#a3b2c4] ml-1.5">
                    {fmt(c.ts)}
                  </span>
                  <p className="text-[13.5px] leading-snug mt-0.5 break-words">
                    {c.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-pixel text-[12px] text-[#7a8ba0] text-center py-1">
              아직 아무도 안 남겼어요. 첫 한마디의 주인공이 되어보세요!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
