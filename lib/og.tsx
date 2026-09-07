import { ImageResponse } from "next/og";

/**
 * OG 공유 이미지 공용 렌더러.
 * 기본 이미지: app/opengraph-image.tsx
 * 향후 연도별 이미지: app/year/[year]/opengraph-image.tsx 에서
 * renderOgImage({ title: "2005", subtitle: "그때로 돌아가기" }) 형태로 재사용.
 */

export const OG_SIZE = { width: 1200, height: 630 };

async function loadPixelFont(): Promise<Buffer | null> {
  try {
    const { readFile } = await import("fs/promises");
    const path = await import("path");
    return await readFile(
      path.join(process.cwd(), "public/fonts/DungGeunMo-full.woff"),
    );
  } catch {
    return null;
  }
}

export async function renderOgImage({
  windowTitle,
  title,
  subtitle,
  footer,
  titleSize = 130,
}: {
  windowTitle: string;
  title: string;
  subtitle: string;
  footer?: string;
  titleSize?: number;
}) {
  const font = await loadPixelFont();
  const fontFamily = font ? "DungGeunMo" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(180deg, #eaf6ff 0%, #cfe9fb 55%, #9ed3f2 100%)",
          fontFamily,
        }}
      >
        {/* XP 스타일 창 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 920,
            borderRadius: 24,
            border: "5px solid #1d2733",
            boxShadow: "14px 14px 0 rgba(29,39,51,0.9)",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          {/* 타이틀바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "18px 28px",
              backgroundImage:
                "linear-gradient(180deg, #7db3e8 0%, #2f6fce 45%, #1c4fa3 100%)",
              borderBottom: "5px solid #1d2733",
              color: "#ffffff",
              fontSize: 32,
            }}
          >
            <span>{windowTitle}</span>
            <div style={{ display: "flex", marginLeft: "auto", gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #1d2733",
                  borderRadius: 8,
                  backgroundImage: "linear-gradient(180deg, #fff, #cfe1f7)",
                  color: "#1d2733",
                  fontSize: 22,
                }}
              >
                –
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #1d2733",
                  borderRadius: 8,
                  backgroundImage: "linear-gradient(180deg, #ff9d9d, #f25555)",
                  color: "#ffffff",
                  fontSize: 22,
                }}
              >
                ×
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "64px 40px 56px",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 26px",
                border: "3px solid #1d2733",
                borderRadius: 999,
                backgroundColor: "#a8e05f",
                boxShadow: "5px 5px 0 rgba(29,39,51,0.9)",
                fontSize: 26,
                color: "#1d2733",
              }}
            >
              📼 {subtitle}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                color: "#1d2733",
                lineHeight: 1,
              }}
            >
              {title}
            </div>
            {footer ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  color: "#5a6b80",
                }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font
        ? [{ name: "DungGeunMo", data: font, style: "normal" as const }]
        : [],
    },
  );
}

/** public/ 경로(/images/…) 또는 절대 URL 이미지를 data URL로 읽는다. 실패 시 null. */
export async function loadImageDataUrl(src: string): Promise<string | null> {
  try {
    if (src.startsWith("/")) {
      const { readFile } = await import("fs/promises");
      const path = await import("path");
      const buf = await readFile(path.join(process.cwd(), "public", src));
      const mime = src.endsWith(".png") ? "image/png" : "image/jpeg";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }
    const res = await fetch(src, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

const OG_CACHE = { "Cache-Control": "public, max-age=86400, s-maxage=86400" };

/**
 * 사진 기반 OG 이미지 — 카드 사진을 꽉 채우고 아래에 제목/부제, 우하단에 카드와 같은 날짜 스탬프.
 * 카카오·인스타 DM·iMessage 미리보기에서 "무슨 추억인지"가 그림으로 바로 보이게 한다.
 */
export async function renderOgPhoto({
  photo,
  badge,
  title,
  subtitle,
  stamp,
}: {
  photo: string;
  badge: string;
  title: string;
  subtitle: string;
  stamp: string;
}) {
  const font = await loadPixelFont();
  const fontFamily = font ? "DungGeunMo" : "sans-serif";
  const titleSize = title.length > 14 ? 64 : title.length > 9 ? 80 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1d2733",
          fontFamily,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        {/* 스캔라인 + 하단 그라데이션 (카드 UI와 같은 질감) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(180deg, rgba(29,39,51,0.35) 0%, rgba(29,39,51,0) 30%, rgba(29,39,51,0) 45%, rgba(29,39,51,0.88) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 40,
            display: "flex",
            alignItems: "center",
            padding: "10px 24px",
            border: "4px solid #1d2733",
            borderRadius: 999,
            backgroundColor: "#a8e05f",
            boxShadow: "5px 5px 0 rgba(29,39,51,0.9)",
            fontSize: 28,
            color: "#1d2733",
          }}
        >
          📼 {badge}
        </div>
        <div
          style={{
            position: "absolute",
            left: 48,
            right: 48,
            bottom: 44,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.05, textShadow: "4px 4px 0 rgba(29,39,51,0.9)" }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#e6eef7", textShadow: "2px 2px 0 rgba(29,39,51,0.9)" }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 40,
            display: "flex",
            fontSize: 34,
            color: "#ff9a1f",
            textShadow: "0 0 10px rgba(255,154,31,0.7), 2px 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          {stamp}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "DungGeunMo", data: font, style: "normal" as const }] : [],
      headers: OG_CACHE,
    },
  );
}

/** 홈 OG — 대표 카드 사진 4장 2×2 콜라주 위에 로고 창을 얹는다. */
export async function renderOgCollage({
  photos,
  windowTitle,
  title,
  subtitle,
  footer,
}: {
  photos: string[];
  windowTitle: string;
  title: string;
  subtitle: string;
  footer: string;
}) {
  const font = await loadPixelFont();
  const fontFamily = font ? "DungGeunMo" : "sans-serif";
  const cells = [
    { left: 0, top: 0 },
    { left: 600, top: 0 },
    { left: 0, top: 315 },
    { left: 600, top: 315 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#cfe9fb",
          fontFamily,
        }}
      >
        {photos.slice(0, 4).map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={p}
            alt=""
            width={600}
            height={315}
            style={{ position: "absolute", left: cells[i].left, top: cells[i].top, width: 600, height: 315, objectFit: "cover" }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(29,39,51,0.15) 0%, rgba(29,39,51,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 120,
            width: 780,
            display: "flex",
            flexDirection: "column",
            borderRadius: 24,
            border: "5px solid #1d2733",
            boxShadow: "14px 14px 0 rgba(29,39,51,0.9)",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 26px",
              backgroundImage: "linear-gradient(180deg, #7db3e8 0%, #2f6fce 45%, #1c4fa3 100%)",
              borderBottom: "5px solid #1d2733",
              color: "#ffffff",
              fontSize: 28,
            }}
          >
            {windowTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 36px 36px", gap: 20 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 24px",
                border: "3px solid #1d2733",
                borderRadius: 999,
                backgroundColor: "#a8e05f",
                boxShadow: "5px 5px 0 rgba(29,39,51,0.9)",
                fontSize: 24,
                color: "#1d2733",
              }}
            >
              📼 {subtitle}
            </div>
            <div style={{ display: "flex", fontSize: 120, color: "#1d2733", lineHeight: 1 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 26, color: "#5a6b80" }}>{footer}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "DungGeunMo", data: font, style: "normal" as const }] : [],
      headers: OG_CACHE,
    },
  );
}

export async function renderStoryImage({
  badge,
  title,
  subtitle,
  footer,
}: {
  badge: string;
  title: string;
  subtitle: string;
  footer: string;
}) {
  const font = await loadPixelFont();
  const fontFamily = font ? "DungGeunMo" : "sans-serif";
  const titleSize = title.length > 18 ? 54 : title.length > 12 ? 68 : 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 72,
          backgroundImage:
            "linear-gradient(180deg, #eaf6ff 0%, #cfe9fb 58%, #9ed3f2 100%)",
          fontFamily,
          color: "#1d2733",
        }}
      >
        <div
          style={{
            width: "100%",
            minHeight: 1210,
            display: "flex",
            flexDirection: "column",
            border: "6px solid #1d2733",
            borderRadius: 24,
            backgroundColor: "#ffffff",
            boxShadow: "18px 18px 0 rgba(29,39,51,0.9)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "26px 32px",
              backgroundImage:
                "linear-gradient(180deg, #7db3e8 0%, #2f6fce 45%, #1c4fa3 100%)",
              borderBottom: "6px solid #1d2733",
              color: "#ffffff",
              fontSize: 40,
            }}
          >
            추억.zip
            <div style={{ display: "flex", marginLeft: "auto", gap: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid #1d2733",
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  color: "#1d2733",
                  fontSize: 28,
                }}
              >
                –
              </div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid #1d2733",
                  borderRadius: 8,
                  backgroundColor: "#f25555",
                  color: "#ffffff",
                  fontSize: 28,
                }}
              >
                ×
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "90px 58px",
              gap: 52,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "14px 30px",
                border: "4px solid #1d2733",
                borderRadius: 999,
                backgroundColor: "#a8e05f",
                boxShadow: "7px 7px 0 rgba(29,39,51,0.9)",
                fontSize: 34,
              }}
            >
              {badge}
            </div>
            <div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.25 }}>
              {title}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 800,
                padding: "30px 38px",
                border: "4px solid #1d2733",
                borderRadius: 18,
                backgroundColor: "#eaf6ff",
                fontSize: 42,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 72,
            fontSize: 34,
            color: "#40546c",
            textAlign: "center",
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: font
        ? [{ name: "DungGeunMo", data: font, style: "normal" as const }]
        : [],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
