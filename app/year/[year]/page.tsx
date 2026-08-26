import type { Metadata } from "next";
import { MEMORIES, getYearInfo } from "@/data/memories";
import YearClient from "@/app/year/[year]/YearClient";

type YearPageProps = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ memory?: string | string[] }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: YearPageProps): Promise<Metadata> {
  const { year: rawYear } = await params;
  const query = await searchParams;
  const year = Number(rawYear);
  const memoryId = Array.isArray(query.memory) ? query.memory[0] : query.memory;
  const memory = MEMORIES.find(
    (item) => item.year === year && item.id === memoryId,
  );
  const info = getYearInfo(year);
  const title = memory ? `${memory.title}, 이거 기억나?` : `${year}년의 추억`;
  const description = memory
    ? `${year}년 ${memory.title}. 같은 시절을 보낸 친구와 기억을 열어보세요.`
    : `${info?.title ?? `${year}년`}의 노래, 유행, 학교생활을 다시 만나보세요.`;
  const image = `/api/og?type=year&year=${encodeURIComponent(rawYear)}&memory=${encodeURIComponent(memory?.title ?? info?.title ?? "그때 기억나?")}`;

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function YearPage({ params }: YearPageProps) {
  const { year } = await params;
  return <YearClient year={Number(year)} />;
}
