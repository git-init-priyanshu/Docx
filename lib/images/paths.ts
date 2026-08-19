// Where an uploaded image lives in Blob storage, and how a document refers to
// it. Shared by the browser (which uploads), the presign route (which authorises
// the upload) and the image route (which authorises the read), so all three
// agree on one scheme.

const ROOT = "documents";

// The document id is part of the blob path because that is the only thing the
// browser hands back when it loads the image — an <img> has no room for a
// second parameter. Deriving it from the path keeps one source of truth.
export const blobPathname = (docId: string, fileName: string) =>
  `${ROOT}/${docId}/${sanitizeFileName(fileName)}`;

export const documentIdFromBlobPath = (segments: string[]) =>
  segments.length > 2 && segments[0] === ROOT ? segments[1] : null;

export const isBlobPathFor = (pathname: string, docId: string) =>
  pathname.startsWith(`${ROOT}/${docId}/`);

// Blob itself only rejects "//", but a name reaches this document as a URL, so
// anything with meaning in one — a query, a fragment, a path separator — has to
// go before it is stored rather than after it has already broken a link.
export function sanitizeFileName(fileName: string) {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+/, "");
  return cleaned.slice(-100) || "image";
}

/**
 * The `src` a document stores for an uploaded image.
 *
 * Blobs in this store are private, so the storage URL answers 403 to the
 * browser. Documents point at this route instead, which checks who is asking
 * before handing the image over — the same rule that governs opening the
 * document the image lives in.
 */
export const imageSrc = (pathname: string) =>
  `/api/image/${pathname.split("/").map(encodeURIComponent).join("/")}`;
