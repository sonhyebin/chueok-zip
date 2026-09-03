"use client";

import { useEffect, useState } from "react";
import { CATEGORY_META, type MemoryItem } from "@/data/memories";
import CommentBox from "@/components/CommentBox";
import ShareButton from "@/components/ShareButton";
import PartnerCta from "@/components/PartnerCta";
import { announcePlay, onPlay } from "@/lib/playerBus";

const PHOTO_BG: Record<string, string> = {
  music: "linear-gradient(135deg, #ffd6e8, #c9b6ff)",
  drama: "linear-gradient(135deg, #ffe9b3, #ffb3c1)",
  movie: "linear-gradient(135deg, #d0d4ff, #8fa6ff)",
  game: "linear-gradient(135deg, #b8f2c9, #7fd8f0)",
  device: "linear-gradient(135deg, #e0e6f0, #aab8d0)",
  internet: "linear-gradient(135deg, #c5e8ff, #8fc7ff)",
  fashion: "linear-gradient(135deg, #ffdcc2, #ff9ec4)",
  food: "linear-gradient(135deg, #fff3b8, #ffc9a3)",
  meme: "linear-gradient(135deg, #d8ffd0, #a3e8ff)",
  school: "linear-gradient(135deg, #fdf3d8, #c9e4c5)",
  photo: "linear-gradient(135deg, #f5f5f5, #cfd8e3)",
};

/** id로부터 결정적으로 날짜 스탬프 생성 (그 시절 디카 감성) */
function stampFor(item: MemoryItem): string {
  let h = 0;
  for (const c of item.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const month = (h % 12) + 1;
  const day = (Math.floor(h / 12) % 28) + 1;
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${item.year}.${mm}.${dd}`;
}

export default function MemoryCard({
  item,
  index,
}: {
  item: MemoryItem;
  index: number;
}) {
  const meta = CATEGORY_META[item.category];
  const [playing, setPlaying] = useState(false);

  // 다른 플레이어가 재생을 시작하면 이 카드는 정지 (오디오 겹침 방지)
  useEffect(() => {
    return onPlay((id) => {
      if (id !== item.id) setPlaying(false);
    });
  }, [item.id]);
  const embedSrc = item.song?.embedUrl
    ? `${item.song.embedUrl}?autoplay=1&playsinline=1&rel=0${item.song.startSec ? `&start=${item.song.startSec}` : ""}`
    : null;
  return (
    <article
      id={`memory-${item.id}`}
      className="window memory-card card-appear scroll-mt-4"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="window-titlebar">
        <span aria-hidden>{meta.emoji}</span>
        <span>{meta.label}</span>
        <span className="win-buttons" aria-hidden>
          <span className="win-btn">–</span>
          <span className="win-btn close">×</span>
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {/* 프레임이 4:3 고정이라 이미지 로딩/비율과 무관하게 레이아웃이 흔들리지 않음.
            이미지 로딩 전·실패 시에는 뒤의 그라데이션+이모지가 그대로 보인다. */}
        <div
          className="photo-frame"
          style={{ background: playing && embedSrc ? "#000" : PHOTO_BG[item.category] }}
        >
          {playing && embedSrc && item.song ? (
            <iframe
              src={embedSrc}
              title={`${item.song.artist} - ${item.song.title}`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <span className="photo-emoji" aria-hidden>
                {meta.emoji}
              </span>
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              {embedSrc && (
                <button
                  type="button"
                  aria-label={`${item.title} 영상 재생`}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    announcePlay(item.id);
                    setPlaying(true);
                  }}
                >
                  <span
                    className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#1d2733] text-white text-[22px] pl-1"
                    style={{
                      background: "rgba(29,39,51,0.65)",
                      boxShadow: "2px 2px 0 rgba(29,39,51,0.9)",
                    }}
                    aria-hidden
                  >
                    ▶
                  </span>
                </button>
              )}
              <span className="datestamp">{stampFor(item)}</span>
            </>
          )}
        </div>

        {item.credit && item.image && (
          <p className="text-[10.5px] leading-tight text-[#8a99ab] -mt-1.5">
            자료:{" "}
            {item.credit.url ? (
              <a
                href={item.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {item.credit.label}
              </a>
            ) : (
              item.credit.label
            )}
          </p>
        )}

        <div>
          <h3 className="font-pixel text-[19px] leading-snug">{item.title}</h3>
          {item.subtitle && (
            <p className="text-[13.5px] text-[#5a6b80] mt-0.5">{item.subtitle}</p>
          )}
          {item.releaseDate && (
            <p className="text-[12px] text-[#7a8ba0] mt-0.5 font-pixel">
              💿 {item.releaseDate} 발매
            </p>
          )}
          {item.priceThen && (
            <p className="price-then">
              <span aria-hidden>🏷️</span> 그때{" "}
              <b>{item.priceThen.then}</b>
              {item.priceThen.now && (
                <>
                  {" "}
                  <span className="price-arrow" aria-hidden>
                    →
                  </span>{" "}
                  지금 {item.priceThen.now}
                </>
              )}
            </p>
          )}
        </div>

        {item.song &&
          (embedSrc ? (
            <button
              type="button"
              className={`pixel-btn ${playing ? "secondary" : "blue"} !w-auto self-start !px-4 !py-2 !text-[13px]`}
              onClick={() =>
                setPlaying((p) => {
                  if (!p) announcePlay(item.id);
                  return !p;
                })
              }
            >
              {playing
                ? "■ 정지"
                : item.category === "music"
                  ? "▶ 하이라이트 듣기"
                  : "▶ 그때 영상 보기"}
            </button>
          ) : (
            <a
              href={item.song.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn blue !w-auto self-start !px-4 !py-2 !text-[13px]"
            >
              ▶ 들어보기
            </a>
          ))}

        {item.prompt && <p className="speech">{item.prompt}</p>}

        {item.cta && (
          <PartnerCta
            app={item.cta.app}
            label={item.cta.label}
            note={item.cta.note}
            campaign={item.id}
          />
        )}

        <ShareButton
          label="🔗 이거 기억나?"
          title={`${item.year} ${item.title}`}
          text={`야 이거 기억나?\n${item.year}년 ${item.title} 보자마자 너 생각남ㅋㅋ`}
          url={`/year/${item.year}?memory=${item.id}#memory-${item.id}`}
          imageUrl={item.image}
          variant="secondary"
          compact
          eventName="memory_share"
          eventProperties={{ year: item.year, card: item.id }}
        />

        <CommentBox cardId={item.id} prompt={item.prompt} />
      </div>
    </article>
  );
}
