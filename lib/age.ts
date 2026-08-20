export const MIN_BIRTH_YEAR = 1970;
export const MAX_BIRTH_YEAR = 2015;

/** 출생연도 기준 단순 연령 (해당 연도 - 출생연도) */
export function ageInYear(bornYear: number, year: number): number {
  return year - bornYear;
}

/**
 * 학창시절 연도 범위: 주로 10대였던 시기 (12세~19세).
 * 예: 1992년생 → 2004~2011 중심이지만 스펙 예시(2003~2010)에 맞춰 11세부터.
 */
export function schoolYears(bornYear: number): number[] {
  const years: number[] = [];
  for (let age = 11; age <= 18; age++) {
    years.push(bornYear + age);
  }
  return years;
}

export function isValidBirthYear(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_BIRTH_YEAR &&
    value <= MAX_BIRTH_YEAR
  );
}

const STORAGE_KEY = "memory.bornYear";
const NAME_KEY = "memory.myName";

export function saveBornYear(year: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(year));
  } catch {}
}

export function loadBornYear(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    const n = parseInt(v, 10);
    return isValidBirthYear(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveMyName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {}
}

export function loadMyName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}
