/** 이름 + 이/가 조사를 받침 유무에 따라 붙인다 */
export function nameIga(name: string): string {
  const last = name.charCodeAt(name.length - 1);
  if (last >= 0xac00 && last <= 0xd7a3) {
    return (last - 0xac00) % 28 > 0 ? `${name}이` : `${name}가`;
  }
  return `${name}이(가)`;
}

/** resultLabel 템플릿의 {name} 치환 */
export function fillLabel(label: string, name: string): string {
  return label.replaceAll("{name}이(가)", nameIga(name)).replaceAll("{name}", name);
}
