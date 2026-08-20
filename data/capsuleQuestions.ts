export type CapsuleQuestion = {
  id: string;
  emoji: string;
  text: string;
  placeholder: string;
  /** 결과 화면에서 답변 앞에 붙는 라벨. {name}은 답변자 이름으로 치환 */
  resultLabel: string;
};

export const CAPSULE_QUESTIONS: CapsuleQuestion[] = [
  {
    id: "first-met",
    emoji: "🏫",
    text: "우리 처음 만난 곳은?",
    placeholder: "예: OO중학교 2학년 3반",
    resultLabel: "{name}이(가) 기억하는 첫 만남",
  },
  {
    id: "hangout",
    emoji: "🍢",
    text: "학교 끝나고 가장 많이 갔던 곳은?",
    placeholder: "예: 학교 앞 분식집, PC방…",
    resultLabel: "{name}의 아지트",
  },
  {
    id: "our-song",
    emoji: "🎧",
    text: "그때 둘이 제일 많이 듣던 노래는?",
    placeholder: "예: SG워너비 - 내 사람",
    resultLabel: "{name}이(가) 기억하는 우리의 노래",
  },
  {
    id: "first-impression",
    emoji: "💬",
    text: "서로의 첫인상은?",
    placeholder: "솔직하게… 이제 와서 못 할 말이 어딨어요",
    resultLabel: "{name}이(가) 기억하는 첫인상",
  },
  {
    id: "one-word",
    emoji: "💌",
    text: "그때 우리에게 한마디 한다면?",
    placeholder: "그 시절의 우리에게…",
    resultLabel: "{name}이(가) 그때의 우리에게",
  },
];
