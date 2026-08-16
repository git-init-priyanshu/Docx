// Snapshot policy shared by the server action and the guest localStorage path,
// so the two never drift. Autosave calls into version creation on every save;
// these rules keep that from flooding storage.

export const VERSION_THROTTLE_MS = 60_000;
export const MAX_VERSIONS = 50;

export const shouldSnapshot = (
  latest: { data: string; createdAt: string | Date } | undefined,
  data: string,
  now = Date.now(),
): boolean => {
  if (!latest) return true;
  if (latest.data === data) return false;
  return now - new Date(latest.createdAt).getTime() >= VERSION_THROTTLE_MS;
};
