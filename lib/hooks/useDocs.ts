"use client";

import useSWR, { mutate } from "swr";

import { GetAllDocs } from "@/app/document/actions";
import { getAllGuestDocuments } from "@/lib/guestServices";

type Doc = {
  id: string;
  name: string;
  data: string | null;
  updatedAt: Date;
  users: { user: { name: string; picture: string } }[];
};

const docsKey = (userId?: string) =>
  userId ? ["docs", userId] : ["docs", "guest"];

async function fetchDocs(userId?: string): Promise<Doc[]> {
  if (userId) {
    const res = await GetAllDocs(userId);
    if (!res.success) throw new Error(res.error ?? "Failed to fetch documents");
    return (res.data ?? []) as Doc[];
  }
  return getAllGuestDocuments() as unknown as Doc[];
}

export function useDocs(userId?: string) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<Doc[]>(
    docsKey(userId),
    () => fetchDocs(userId),
    { revalidateOnFocus: false },
  );

  return {
    docs: data ?? [],
    isLoading,
    error,
    revalidate,
  };
}

/** Call after any mutation that changes the document list (create, delete, rename). */
export const invalidateDocs = (userId?: string) =>
  mutate(docsKey(userId));
