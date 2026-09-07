import type { Metadata } from "next";
import { MEMORIES, getYearInfo } from "@/data/memories";
import { isValidBirthYear, koreanAgeInYear } from "@/lib/age";
import YearClient from "@/app/year/[year]/YearClient";

type YearPageProps = {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ memory?: string | string[]; born?: string | string[] }>;
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
  const rawBorn = Array.isArray(query.born) ? query.born[0] : query.born;
  const born = Number(rawBorn);
  // 공유한 사람의 출생연도가 링크에 있으면 "우리 N살 때"로 — 같은 시절 친구에게 보내는 링크라는 전제
  const age = isValidBirthYear(born) ? koreanAgeInYear(born, year) : null;
  const when = age ? `${year}년, 우리 ${age}살 때` : `${year}년`;
  const title = memory ? `${memory.title}, 이거 기억나?` : age ? `${when}의 추억` : `${year}년의 추억`;
  const description = memory
    ? `${when} ${memory.title}${memory.subtitle ? ` — ${memory.subtitle}` : ""}. 같은 시절을 보낸 친구와 기억을 열어보세요.`
    : `${info?.title ?? `${year}년`}의 노래, 유행, 학교생활을 다시 만나보세요.`;
  const ogParams = new URLSearchParams({ type: "year", year: rawYear });
  if (memory) ogParams.set("memory", memory.id);
  else ogParams.set("memory", info?.title ?? "그때 기억나?");
  if (age) ogParams.set("born", String(born));
  const image = `/api/og?${ogParams.toString()}`;

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
