/**
 * 타임캡슐 상태를 URL에 인코딩하는 MVP 구현.
 * 서버 저장이 필요해지면 이 파일의 encode/decode만
 * API 호출(생성 → id 반환)로 교체하면 된다.
 */

export type CapsuleVersion = 1 | 2;

export type CapsuleInvite = {
  v: CapsuleVersion;
  kind: "invite";
  year: number;
  from: string;
  answers: string[];
};

export type CapsuleResult = {
  v: CapsuleVersion;
  kind: "result";
  year: number;
  a: { name: string; answers: string[] };
  b: { name: string; answers: string[] };
};

export type CapsuleCipher = {
  algorithm: "AES-GCM";
  iv: string;
  data: string;
};

/**
 * Blob에는 공유 미리보기에 필요한 최소 정보와 암호문만 저장한다.
 * 복호화 키는 URL fragment(#k=...)에 있어 서버와 SNS 크롤러로 전송되지 않는다.
 */
export type CapsuleRecord = {
  schema: 1;
  kind: "invite" | "result";
  year: number;
  fromName?: string;
  aName?: string;
  bName?: string;
  cipher: CapsuleCipher;
  updateProofHash: string;
  createdAt: number;
};

const BASE64_URL = /^[A-Za-z0-9_-]+$/;

function isName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 12;
}

function isAnswers(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every(
      (answer) =>
        typeof answer === "string" &&
        answer.trim().length > 0 &&
        answer.length <= 200,
    )
  );
}

export function isCapsuleInvite(value: unknown): value is CapsuleInvite {
  if (!value || typeof value !== "object") return false;
  const invite = value as Partial<CapsuleInvite>;
  return (
    (invite.v === 1 || invite.v === 2) &&
    invite.kind === "invite" &&
    Number.isInteger(invite.year) &&
    isName(invite.from) &&
    isAnswers(invite.answers)
  );
}

export function isCapsuleResult(value: unknown): value is CapsuleResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<CapsuleResult>;
  return (
    (result.v === 1 || result.v === 2) &&
    result.kind === "result" &&
    Number.isInteger(result.year) &&
    Boolean(result.a) &&
    Boolean(result.b) &&
    isName(result.a?.name) &&
    isAnswers(result.a?.answers) &&
    isName(result.b?.name) &&
    isAnswers(result.b?.answers)
  );
}

export function isCapsuleRecord(value: unknown): value is CapsuleRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<CapsuleRecord>;
  const cipher = record.cipher;
  if (
    record.schema !== 1 ||
    (record.kind !== "invite" && record.kind !== "result") ||
    !Number.isInteger(record.year) ||
    typeof record.createdAt !== "number" ||
    !cipher ||
    cipher.algorithm !== "AES-GCM" ||
    typeof cipher.iv !== "string" ||
    cipher.iv.length > 32 ||
    !BASE64_URL.test(cipher.iv) ||
    typeof cipher.data !== "string" ||
    cipher.data.length > 12000 ||
    !BASE64_URL.test(cipher.data) ||
    typeof record.updateProofHash !== "string" ||
    record.updateProofHash.length !== 43 ||
    !BASE64_URL.test(record.updateProofHash)
  ) {
    return false;
  }
  return record.kind === "invite"
    ? isName(record.fromName)
    : isName(record.aName) && isName(record.bName);
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeCapsule(data: CapsuleInvite | CapsuleResult): string {
  return toBase64Url(JSON.stringify(data));
}

export function decodeInvite(d: string): CapsuleInvite | null {
  try {
    const obj = JSON.parse(fromBase64Url(d));
    return isCapsuleInvite(obj) ? obj : null;
  } catch {
    return null;
  }
}

export function decodeResult(d: string): CapsuleResult | null {
  try {
    const obj = JSON.parse(fromBase64Url(d));
    return isCapsuleResult(obj) ? obj : null;
  } catch {
    return null;
  }
}
