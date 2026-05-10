"use client";

import useSWR, { mutate } from "swr";
import type { Document } from "@prisma/client";

import { GetDocDetails } from "@/app/writer/[id]/actions";
import { getGuestDocumentDetails } from "@/lib/guestServices";

const docKey = (docId: string) => ["doc", docId];

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

export function useDoc(docId: string, userId?: string) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<
    Document | undefined
  >(
    docId ? docKey(docId) : null,
    () => fetchDoc(docId, userId),
    { revalidateOnFocus: false },
  );

  return {
    doc: data,
    isLoading,
    error,
    revalidate,
  };
}

/** Call after saving content or thumbnail to reflect latest data. */
export const invalidateDoc = (docId: string) => mutate(docKey(docId));
