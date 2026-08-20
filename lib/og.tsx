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
      path.join(process.cwd(), "public/fonts/DungGeunMo.woff"),
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
}: {
  windowTitle: string;
  title: string;
  subtitle: string;
  footer?: string;
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
                fontSize: 130,
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
