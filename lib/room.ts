// Room naming and token lifetime. Isomorphic on purpose: the browser needs
// both to build the socket URL and schedule refreshes, so this file must stay
// free of node: imports — lib/roomToken.ts holds the crypto half.

export const ROOM_TOKEN_TTL_MS = 5 * 60_000;

// Room names are namespaced so a document id alone is never a room name.
export const roomForDoc = (docId: string) => `doc.${docId}`;
