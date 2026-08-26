import "server-only";

import { list } from "@vercel/blob";
import { isCapsuleRecord, type CapsuleRecord } from "@/lib/capsule";

export const CAPSULE_ID = /^[A-Za-z0-9_-]{12}$/;

export function capsulePath(id: string): string {
  return `capsules/${id}.json`;
}

export function capsulePrefix(id: string): string {
  return `capsules-v2/${id}/`;
}

export function capsuleInvitePath(id: string): string {
  return `${capsulePrefix(id)}invite.json`;
}

export function capsuleResultPath(id: string): string {
  return `${capsulePrefix(id)}result.json`;
}

async function readRecordAt(pathname: string): Promise<CapsuleRecord | null> {
  const { blobs } = await list({ prefix: pathname, limit: 5 });
  const blob = blobs.find((item) => item.pathname === pathname);
  if (!blob) return null;
  const separator = blob.url.includes("?") ? "&" : "?";
  const response = await fetch(
    `${blob.url}${separator}v=${blob.uploadedAt.getTime()}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  const value: unknown = await response.json();
  return isCapsuleRecord(value) ? value : null;
}

export async function getCapsuleRecord(
  id: string,
): Promise<CapsuleRecord | null> {
  if (!CAPSULE_ID.test(id)) return null;
  try {
    const { blobs } = await list({ prefix: capsulePrefix(id), limit: 10 });
    const resultBlob = blobs.find(
      (item) => item.pathname === capsuleResultPath(id),
    );
    const inviteBlob = blobs.find(
      (item) => item.pathname === capsuleInvitePath(id),
    );
    const currentBlob = resultBlob ?? inviteBlob;
    if (currentBlob) {
      const separator = currentBlob.url.includes("?") ? "&" : "?";
      const response = await fetch(
        `${currentBlob.url}${separator}v=${currentBlob.uploadedAt.getTime()}`,
        { cache: "no-store" },
      );
      if (response.ok) {
        const value: unknown = await response.json();
        if (isCapsuleRecord(value)) return value;
      }
    }

    // 첫 짧은 링크 배포에서 생성된 capsules/<id>.json도 계속 지원한다.
    return readRecordAt(capsulePath(id));
  } catch {
    return null;
  }
}
