import type { Metadata } from "next";
import JeboClient from "@/app/jebo/JeboClient";

export const metadata: Metadata = {
  title: "추억 제보함",
  description:
    "서랍 속 그때 그 사진, 알려주시면 카드로 만들어 올려드릴게요.",
};

export default function JeboPage() {
  return <JeboClient />;
}
