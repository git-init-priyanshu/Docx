import { put } from "@vercel/blob";

import { blobPathname, imageSrc } from "@/lib/images/paths";
import type { TiptapNode } from "./toTiptap";

// Enough at once to keep an image-heavy import inside a function timeout,
// without opening a connection per image on a document with dozens.
const CONCURRENCY = 4;

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

const collectImages = (node: TiptapNode, found: TiptapNode[] = []) => {
  if (node.type === "image") found.push(node);
  for (const child of node.content ?? []) collectImages(child, found);
  return found;
};

// An image that could not be copied is removed rather than left pointing at a
// URL that will 404 within the hour.
const pruneEmptyImages = (node: TiptapNode): TiptapNode => {
  if (!node.content) return node;
  return {
    ...node,
    content: node.content
      .filter((child) => child.type !== "image" || child.attrs?.src)
      .map(pruneEmptyImages),
  };
};

/**
 * Copies each imported image into Blob storage and rewrites its `src`.
 *
 * Google serves document images from a `contentUri` it documents as valid for
 * around 30 minutes, so keeping the link rather than the bytes would give every
 * import an afternoon's shelf life.
 *
 * The fetch runs here rather than in the browser for two reasons: those URLs
 * carry no CORS headers, and the browser's Google access token deliberately
 * never reaches the server, so there is no authenticated fetch to forward. The
 * URLs are pre-signed and need no credentials, and an image that turns out to
 * need them simply fails and is reported.
 *
 * `docId` is the id the imported document is about to be created with. Images
 * are stored under it and served through the image route, exactly as an image
 * uploaded in the editor is, so nothing downstream has to know where a picture
 * came from.
 */
export const rehostImages = async (doc: TiptapNode, docId: string) => {
  const images = collectImages(doc);
  if (images.length === 0) return { doc, failed: 0 };

  let failed = 0;

  const copy = async (node: TiptapNode, index: number) => {
    const source = node.attrs?.src as string | undefined;
    if (!source) return;

    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(String(response.status));

      const blob = await response.blob();
      const extension = EXTENSIONS[blob.type];
      if (!extension) throw new Error(`unsupported type ${blob.type}`);

      const stored = await put(
        blobPathname(docId, `imported-${index + 1}.${extension}`),
        blob,
        {
          // Explicit for the same reason as the upload route: without it the
          // SDK prefers VERCEL_OIDC_TOKEN whenever BLOB_STORE_ID is set, and
          // OIDC is not enabled in every environment.
          token: process.env.BLOB_READ_WRITE_TOKEN,
          access: "private",
          addRandomSuffix: true,
          contentType: blob.type,
        },
      );

      node.attrs = { ...node.attrs, src: imageSrc(stored.pathname) };
    } catch {
      failed += 1;
      node.attrs = { ...node.attrs, src: "" };
    }
  };

  for (let start = 0; start < images.length; start += CONCURRENCY) {
    await Promise.all(
      images
        .slice(start, start + CONCURRENCY)
        .map((node, offset) => copy(node, start + offset)),
    );
  }

  return { doc: failed > 0 ? pruneEmptyImages(doc) : doc, failed };
};
