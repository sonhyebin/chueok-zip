import { CATEGORY_META, type MemoryItem } from "@/data/memories";

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
  return (
    <article
      className="window card-appear"
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
          style={{ background: PHOTO_BG[item.category] }}
        >
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
          <span className="datestamp">{stampFor(item)}</span>
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
        </div>

        {item.prompt && <p className="speech">{item.prompt}</p>}
      </div>
    </article>
  );
}
