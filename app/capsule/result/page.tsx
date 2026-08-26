import type { Metadata } from "next";
import { decodeResult } from "@/lib/capsule";
import { getCapsuleRecord } from "@/lib/capsuleStore";
import CapsuleResultClient from "@/app/capsule/result/CapsuleResultClient";

type ResultPageProps = {
  searchParams: Promise<{
    c?: string | string[];
    d?: string | string[];
  }>;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export async function generateMetadata({
  searchParams,
}: ResultPageProps): Promise<Metadata> {
  const query = await searchParams;
  const id = first(query.c);
  const record = id ? await getCapsuleRecord(id) : null;
  const legacy = !record ? decodeResult(first(query.d)) : null;
  const year = record?.year ?? legacy?.year;
  const a = record?.aName ?? legacy?.a.name;
  const b = record?.bName ?? legacy?.b.name;

  if (!year || !a || !b) {
    return { title: "타임캡슐 결과 | 추억.zip", robots: { index: false } };
  }
  const title = `${a} × ${b}의 ${year} 타임캡슐`;
  const description = "첫인상부터 지금도 웃긴 사건까지, 두 사람이 기억한 그때를 나란히 열어보세요.";
  const image = `/api/og?type=result&year=${year}&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const query = await searchParams;
  const id = first(query.c);
  const record = id ? await getCapsuleRecord(id) : null;
  const legacyResult = !id ? decodeResult(first(query.d)) : null;

  return (
    <CapsuleResultClient
      capsuleId={id}
      record={record}
      legacyResult={legacyResult}
    />
  );
}
