import type { Metadata } from "next";
import { isValidBirthYear } from "@/lib/age";
import TimelineClient from "@/app/timeline/TimelineClient";

type TimelinePageProps = {
  searchParams: Promise<{ born?: string | string[] }>;
};

export async function generateMetadata({
  searchParams,
}: TimelinePageProps): Promise<Metadata> {
  const query = await searchParams;
  const rawBorn = Array.isArray(query.born) ? query.born[0] : query.born;
  const born = Number(rawBorn);
  if (!isValidBirthYear(born)) {
    return { title: "내 학창시절.zip" };
  }
  const title = `${born}년생의 학창시절.zip`;
  const description = `${born}년생이라면 자동으로 떠오르는 노래, 유행, 학교생활. 같은 시절을 보낸 친구를 불러보세요.`;
  const image = `/api/og?type=school&born=${born}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function TimelinePage() {
  return <TimelineClient />;
}
