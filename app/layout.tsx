import type { Metadata, Viewport } from "next";
import { SERVICE_NAME, SERVICE_TAGLINE } from "@/lib/config";
import "./globals.css";

// OG 이미지 등 절대 URL 생성 기준. 커스텀 도메인 연결 시 NEXT_PUBLIC_SITE_URL만 설정하면 됨
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SERVICE_NAME,
  description: SERVICE_TAGLINE,
  openGraph: {
    title: SERVICE_NAME,
    description: SERVICE_TAGLINE,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#cfe9fb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
