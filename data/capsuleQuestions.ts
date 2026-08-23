export type CapsuleQuestion = {
  id: string;
  emoji: string;
  text: string;
  placeholder: string;
  /** 결과 화면에서 답변 앞에 붙는 라벨. {name}은 답변자 이름으로 치환 */
  resultLabel: string;
};

export const LEGACY_CAPSULE_QUESTIONS: CapsuleQuestion[] = [
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

export const CAPSULE_QUESTIONS: CapsuleQuestion[] = [
  {
    id: "first-impression",
    emoji: "👀",
    text: "처음 봤을 때 솔직히 무슨 생각했어?",
    placeholder: "예: 무서워 보였는데 먼저 말 걸어줘서 의외였어",
    resultLabel: "{name}의 솔직한 첫인상",
  },
  {
    id: "impression-reveal",
    emoji: "🔄",
    text: "친해지고 나서 첫인상과 제일 달랐던 점은?",
    placeholder: "예: 조용한 줄 알았는데 제일 시끄러웠음",
    resultLabel: "{name}이(가) 느낀 첫인상 반전",
  },
  {
    id: "silly-routine",
    emoji: "🤪",
    text: "우리 둘이 제일 많이 했던 쓸데없는 짓은?",
    placeholder: "예: 쉬는 시간마다 매점까지 전력 질주하기",
    resultLabel: "{name}이(가) 기억하는 우리의 쓸데없는 짓",
  },
  {
    id: "funniest-story",
    emoji: "😂",
    text: "지금 생각해도 웃긴 우리 사건 하나만 꼽는다면?",
    placeholder: "예: 수업 시간에 웃음 참다가 같이 쫓겨난 날",
    resultLabel: "{name}이(가) 꼽은 제일 웃긴 사건",
  },
  {
    id: "one-day-back",
    emoji: "⏪",
    text: "딱 하루 그때로 돌아간다면, 우리 뭐부터 할까?",
    placeholder: "예: 하교하자마자 떡볶이 먹으러 가기",
    resultLabel: "{name}이(가) 돌아가면 제일 먼저 할 일",
  },
];
