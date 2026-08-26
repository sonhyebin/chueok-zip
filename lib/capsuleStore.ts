import "server-only";

import { get } from "@vercel/blob";
import { isCapsuleRecord, type CapsuleRecord } from "@/lib/capsule";

export const CAPSULE_ID = /^[A-Za-z0-9_-]{12}$/;

export function capsulePath(id: string): string {
  return `capsules/${id}.json`;
}

export async function getCapsuleRecord(
  id: string,
): Promise<CapsuleRecord | null> {
  if (!CAPSULE_ID.test(id)) return null;
  try {
    const blob = await get(capsulePath(id), {
      access: "public",
      useCache: false,
    });
    if (!blob || blob.statusCode !== 200) return null;
    const value: unknown = await new Response(blob.stream).json();
    return isCapsuleRecord(value) ? value : null;
  } catch {
    return null;
  }
}
