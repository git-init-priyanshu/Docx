"use client";

import useSWR, { mutate } from "swr";

import { GetDocVersions } from "@/app/writer/[id]/versions/actions";
import { getGuestVersions } from "@/lib/guestServices";

export type DocVersion = {
  id: string;
  data: string;
  createdAt: string | Date;
};

// userId: null = session still resolving (defer); undefined = guest; string = authenticated
const versionsKey = (docId: string, userId: string) => [
  "versions",
  docId,
  userId,
];

async function fetchVersions(
  docId: string,
  userId?: string,
): Promise<DocVersion[]> {
  if (userId) {
    const res = await GetDocVersions(docId);
    if (!res.success) throw new Error(res.error ?? "Failed to fetch versions");
    return (res.data as DocVersion[]) ?? [];
  }
  return getGuestVersions(docId) as DocVersion[];
}

export function useVersions(docId: string, userId: string | null | undefined) {
  const ready = userId !== null;
  const key = docId && ready ? versionsKey(docId, userId ?? "guest") : null;

  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR<DocVersion[]>(
    key,
    () => fetchVersions(docId, userId ?? undefined),
    { revalidateOnFocus: false },
  );

  return { versions: data, isLoading, error, revalidate };
}

export const invalidateVersions = (docId: string) =>
  mutate(
    (key: unknown) =>
      Array.isArray(key) && key[0] === "versions" && key[1] === docId,
  );
