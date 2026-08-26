import type {
  CapsuleCipher,
  CapsuleInvite,
  CapsuleResult,
} from "@/lib/capsule";
import { isCapsuleInvite, isCapsuleResult } from "@/lib/capsule";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function digest(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hashed = await crypto.subtle.digest("SHA-256", bytes);
  return toBase64Url(new Uint8Array(hashed));
}

async function importKey(rawKey: Uint8Array, usage: KeyUsage[]) {
  return crypto.subtle.importKey("raw", rawKey as BufferSource, "AES-GCM", false, usage);
}

export async function encryptCapsule(
  capsule: CapsuleInvite | CapsuleResult,
  existingKey?: string,
): Promise<{ cipher: CapsuleCipher; key: string }> {
  const rawKey = existingKey
    ? fromBase64Url(existingKey)
    : crypto.getRandomValues(new Uint8Array(32));
  if (rawKey.length !== 32) throw new Error("invalid capsule key");

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKey(rawKey, ["encrypt"]);
  const plain = new TextEncoder().encode(JSON.stringify(capsule));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    plain,
  );

  return {
    key: toBase64Url(rawKey),
    cipher: {
      algorithm: "AES-GCM",
      iv: toBase64Url(iv),
      data: toBase64Url(new Uint8Array(encrypted)),
    },
  };
}

export async function decryptCapsule(
  cipher: CapsuleCipher,
  encodedKey: string,
): Promise<CapsuleInvite | CapsuleResult | null> {
  try {
    const rawKey = fromBase64Url(encodedKey);
    if (rawKey.length !== 32) return null;
    const key = await importKey(rawKey, ["decrypt"]);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64Url(cipher.iv) as BufferSource },
      key,
      fromBase64Url(cipher.data) as BufferSource,
    );
    const value: unknown = JSON.parse(new TextDecoder().decode(decrypted));
    if (isCapsuleInvite(value) || isCapsuleResult(value)) return value;
    return null;
  } catch {
    return null;
  }
}

export function getCapsuleKeyFromHash(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.hash.slice(1)).get("k") ?? "";
}

export function appendCapsuleKey(url: string, key: string): string {
  return `${url}#k=${encodeURIComponent(key)}`;
}

/** 서버가 AES 키를 알지 않고도 완료 요청이 링크 소유자에게서 왔는지 확인한다. */
export function createCapsuleUpdateProof(key: string): Promise<string> {
  return digest(`chueok.zip:update:${key}`);
}

export function hashCapsuleUpdateProof(proof: string): Promise<string> {
  return digest(proof);
}
