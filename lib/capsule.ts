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
    if (
      (obj?.v === 1 || obj?.v === 2) &&
      obj?.kind === "invite" &&
      Array.isArray(obj.answers)
    ) {
      return obj as CapsuleInvite;
    }
    return null;
  } catch {
    return null;
  }
}

export function decodeResult(d: string): CapsuleResult | null {
  try {
    const obj = JSON.parse(fromBase64Url(d));
    if (
      (obj?.v === 1 || obj?.v === 2) &&
      obj?.kind === "result" &&
      obj.a &&
      obj.b
    ) {
      return obj as CapsuleResult;
    }
    return null;
  } catch {
    return null;
  }
}
