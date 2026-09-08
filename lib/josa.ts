/**
 * 이름 + 주격 조사를 받침 유무에 따라 붙인다.
 * 받침 있는 이름은 호칭 접미사 '이'까지 포함해 자연스럽게 처리:
 * 혜빈 → 혜빈이가, 수진 → 수진이가, 민수 → 민수가, 지우 → 지우가
 */
export function nameIga(name: string): string {
  const last = name.charCodeAt(name.length - 1);
  if (last >= 0xac00 && last <= 0xd7a3) {
    return (last - 0xac00) % 28 > 0 ? `${name}이가` : `${name}가`;
  }
  return `${name}이(가)`;
}

/** resultLabel 템플릿의 {name} 치환 */
export function fillLabel(label: string, name: string): string {
  return label.replaceAll("{name}이(가)", nameIga(name)).replaceAll("{name}", name);
}

/** 이름 + 을/를 (받침 유무로 선택). 예: 혜빈 → 혜빈을, 수지 → 수지를 */
export function nameEulReul(name: string): string {
  const last = name.trim().slice(-1);
  const code = last.charCodeAt(0);
  const hangul = code >= 0xac00 && code <= 0xd7a3;
  const hasBatchim = hangul ? (code - 0xac00) % 28 !== 0 : false;
  return `${name.trim()}${hasBatchim ? "을" : "를"}`;
}

/**
 * 질문 문장의 {friend} 를 상대 이름(을/를 포함)으로 치환.
 * 상대 이름을 아직 모르면(보내는 쪽) "그 친구를".
 */
export function fillQuestion(
  text: string,
  friendName?: string,
  fallback = "그 친구를",
): string {
  const who = friendName && friendName.trim() ? nameEulReul(friendName) : fallback;
  return text.replaceAll("{friend}", who);
}
