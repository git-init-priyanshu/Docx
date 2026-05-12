"use client";

import useSWR, { mutate } from "swr";
import type { Document } from "@prisma/client";

import { GetDocDetails } from "@/app/writer/[id]/actions";
import { getGuestDocumentDetails } from "@/lib/guestServices";

// userId: null = session still resolving (defer); undefined = guest; string = authenticated
const docKey = (docId: string, userId: string) => ["doc", docId, userId];

async function fetchDoc(
  docId: string,
  userId?: string,
): Promise<Document | undefined> {
  if (userId) {
    const res = await GetDocDetails(docId);
    if (!res.success) throw new Error(res.error ?? "Failed to fetch document");
    return res.data as Document;
  }
  return getGuestDocumentDetails(docId);
}

export function useDoc(docId: string, userId: string | null | undefined) {
  const ready = userId !== null;
  const key = docId && ready ? docKey(docId, userId ?? "guest") : null;

  const { data, error, isLoading, mutate: revalidate } = useSWR<
    Document | undefined
  >(
    key,
    () => fetchDoc(docId, userId ?? undefined),
    { revalidateOnFocus: false },
  );

  return { doc: data, isLoading, error, revalidate };
}

export const invalidateDoc = (docId: string) =>
  mutate(
    (key: unknown) =>
      Array.isArray(key) && key[0] === "doc" && key[1] === docId,
  );
