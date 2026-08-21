"use client";

import { useEffect, useState } from "react";
import type { YearSong } from "@/data/memories";
import { announcePlay, onPlay } from "@/lib/playerBus";

/**
 * 미니홈피 BGM / 2000년대 MP3 플레이어 감성의 작은 음악 영역.
 *
 * - 자동재생 없음: 사용자가 ▶ 재생을 눌러야 공식 임베드(iframe)가 로드된다.
 * - 재생은 반드시 provider의 공식 임베드 플레이어로만 한다 (음원 추출·숨김 금지).
 * - embedUrl이 없으면 externalUrl 새 탭 이동 버튼만 표시 (폴백).
 * - 페이지당 플레이어는 1개이고, 페이지 이동 시 iframe이 언마운트되어 재생이 멈추므로
 *   여러 곡이 동시에 재생될 일은 없다.
 */
export default function BgmPlayer({ song }: { song: YearSong }) {
  const [playing, setPlaying] = useState(false);
  const busId = `bgm:${song.title}`;

  // 다른 플레이어 재생 시 자동 정지 (오디오 겹침 방지)
  useEffect(() => {
    return onPlay((id) => {
      if (id !== busId) setPlaying(false);
    });
  }, [busId]);

  const canEmbed = Boolean(song.embedUrl);
  const startParam = song.startSec ? `&start=${song.startSec}` : "";
  const embedSrc = canEmbed
    ? `${song.embedUrl}?autoplay=1&playsinline=1&rel=0${startParam}`
    : null;

  return (
    <div className="window">
      <div className="window-titlebar !py-1.5">
        <span aria-hidden>♪</span>
        <span className="text-[13px]">BGM — 그때 우리가 듣던 노래</span>
        <span className="win-buttons" aria-hidden>
          <span className="win-btn">–</span>
          <span className="win-btn close">×</span>
        </span>
      </div>

      <div className="p-3 flex items-center gap-3">
        <div
          className="w-12 h-12 shrink-0 flex items-center justify-center border-2 border-[#1d2733] rounded-lg text-[22px]"
          style={{
            background: "linear-gradient(135deg, #ffd6e8, #c9b6ff)",
            boxShadow: "2px 2px 0 rgba(29,39,51,0.9)",
          }}
          aria-hidden
        >
          💿
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[16px] leading-tight truncate">
            {song.title}
          </p>
          <p className="text-[12.5px] text-[#5a6b80] truncate">{song.artist}</p>
          {/* 장식용 재생바 — 실제 재생 상태는 임베드 플레이어가 표시 */}
          <p
            className="font-pixel text-[11px] text-[#7a8ba0] mt-1 overflow-hidden whitespace-nowrap"
            aria-hidden
          >
            {playing ? "♪ 재생 중 ━━━●━━━━━━" : "━○━━━━━━━━━━ 0:00"}
          </p>
        </div>

        {canEmbed ? (
          <button
            type="button"
            className={`pixel-btn ${playing ? "secondary" : "blue"} !w-auto !px-4 !py-2.5 !text-[14px] shrink-0`}
            onClick={() =>
              setPlaying((p) => {
                if (!p) announcePlay(busId);
                return !p;
              })
            }
          >
            {playing ? "■ 정지" : "▶ 재생"}
          </button>
        ) : (
          <a
            href={song.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn blue !w-auto !px-4 !py-2.5 !text-[14px] shrink-0"
          >
            ▶ 들어보기
          </a>
        )}
      </div>

      {playing && embedSrc && (
        <div className="px-3 pb-3">
          <div
            className="border-2 border-[#1d2733] rounded-lg overflow-hidden"
            style={{ aspectRatio: "16 / 9", background: "#000" }}
          >
            <iframe
              src={embedSrc}
              title={`${song.artist} - ${song.title}`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <p className="px-3 pb-2 text-[11px] text-[#7a8ba0] font-pixel">
        ※ 공식 플레이어로 재생돼요 ·{" "}
        <a
          href={song.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          원본 페이지 열기
        </a>
      </p>
    </div>
  );
}
