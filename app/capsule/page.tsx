import type { Metadata } from "next";
import { decodeInvite } from "@/lib/capsule";
import { getCapsuleRecord } from "@/lib/capsuleStore";
import CapsuleInviteClient from "@/app/capsule/CapsuleInviteClient";

type CapsulePageProps = {
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
}: CapsulePageProps): Promise<Metadata> {
  const query = await searchParams;
  const id = first(query.c);
  const record = id ? await getCapsuleRecord(id) : null;
  const legacy = !record ? decodeInvite(first(query.d)) : null;
  const year = record?.year ?? legacy?.year;
  const from = record?.fromName ?? record?.aName ?? legacy?.from;

  if (!year || !from) {
    return { title: "타임캡슐 초대 | 추억.zip", robots: { index: false } };
  }
  const completed = record?.kind === "result";
  const title = completed
    ? `${record.aName} × ${record.bName}의 ${year} 타임캡슐`
    : `${from}님이 ${year}년에서 보낸 타임캡슐`;
  const description = completed
    ? "첫인상부터 지금도 웃긴 사건까지, 두 사람이 기억한 그때를 나란히 열어보세요."
    : `${from}님은 이미 답했어요. 내가 답해야 서로의 첫인상과 추억이 열려요.`;
  const image = completed
    ? `/api/og?type=result&year=${year}&a=${encodeURIComponent(record.aName ?? "")}&b=${encodeURIComponent(record.bName ?? "")}`
    : `/api/og?type=invite&year=${year}&from=${encodeURIComponent(from)}`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CapsulePage({ searchParams }: CapsulePageProps) {
  const query = await searchParams;
  const id = first(query.c);
  const record = id ? await getCapsuleRecord(id) : null;
  const legacyInvite = !id ? decodeInvite(first(query.d)) : null;

  return (
    <CapsuleInviteClient
      capsuleId={id}
      record={record}
      legacyInvite={legacyInvite}
    />
  );
}
