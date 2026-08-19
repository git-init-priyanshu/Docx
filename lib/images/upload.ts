import { uploadPresigned } from "@vercel/blob/client";

import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES } from "./constants";
import { blobPathname, imageSrc } from "./paths";

/**
 * What an image node ends up carrying.
 *
 * `thumbData` is a tiny copy of the same picture, encoded into the node itself.
 * A dashboard draws images about 36px tall, and fetching a file for that meant
 * the picture always arrived a beat after the text around it. Inlined, it is
 * part of the same payload and paints in the same frame.
 */
export type UploadedImage = {
  src: string;
  thumbData: string | null;
  // The image's own size. An editor lays an image out at its natural width,
  // capped to the column, so a preview has to know that width to keep the
  // picture the same size relative to the text around it.
  width: number | null;
  height: number | null;
};

export const isSupportedImage = (file: File) =>
  ALLOWED_CONTENT_TYPES.includes(file.type);

// Guest documents live in localStorage, which holds roughly 5MB for the whole
// origin — a handful of untouched photos would fill it. Guest images are
// re-encoded to fit, and refused outright when even that is not enough.
const GUEST_MAX_EDGE = 1280;
const GUEST_MAX_BYTES = 1024 * 1024;

// A thumbnail renders about 36px tall, so 128px still has headroom for a
// high-density screen while staying small enough to inline.
const THUMBNAIL_MAX_EDGE = 128;
const THUMBNAIL_QUALITY = 0.5;

// Anything larger is not worth carrying inside every copy of the document.
const THUMBNAIL_MAX_BYTES = 8 * 1024;

const readBitmap = async (file: File) => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("That file could not be read as an image");
  }
};

// A canvas keeps only the first frame of a GIF, so animation is lost either
// way; PNG is kept for its transparency and everything else becomes JPEG.
const outputTypeFor = (file: File) =>
  file.type === "image/png" ? "image/png" : "image/jpeg";

const drawScaled = async (file: File, maxEdge: number) => {
  const bitmap = await readBitmap(file);
  const natural = { width: bitmap.width, height: bitmap.height };
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("That image could not be processed");

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return { canvas, natural };
};

const toDataUrl = async (file: File) => {
  const { canvas } = await drawScaled(file, GUEST_MAX_EDGE);
  const dataUrl = canvas.toDataURL(outputTypeFor(file), 0.8);

  if (dataUrl.length > GUEST_MAX_BYTES)
    throw new Error("Sign in to add images this large");

  // A guest's image is re-encoded rather than stored as it arrived, so the
  // canvas dimensions are the ones the document will lay out.
  return { dataUrl, width: canvas.width, height: canvas.height };
};

/**
 * The inline thumbnail, or null when one cannot be made small enough.
 *
 * WebP is asked for first because it is the only one of the three that is both
 * small and keeps transparency — a logo on a page would otherwise need PNG,
 * which at this quality is several times the size. A browser that cannot encode
 * it returns PNG instead of failing, so the result is checked rather than
 * assumed, and JPEG is the fallback.
 */
const toInlineThumbnail = async (file: File) => {
  try {
    const { canvas, natural } = await drawScaled(file, THUMBNAIL_MAX_EDGE);

    const webp = canvas.toDataURL("image/webp", THUMBNAIL_QUALITY);
    const dataUrl = webp.startsWith("data:image/webp")
      ? webp
      : canvas.toDataURL("image/jpeg", THUMBNAIL_QUALITY);

    return {
      ...natural,
      thumbData: dataUrl.length > THUMBNAIL_MAX_BYTES ? null : dataUrl,
    };
  } catch {
    // A missing thumbnail costs a slower dashboard, nothing more, so it must
    // never be the reason an image fails to go into a document.
    return null;
  }
};

/**
 * Puts an image where a document can point at it.
 *
 * Signed-in uploads go to Blob storage and come back as URLs. Guests have no
 * session to mint an upload token with, so their images are inlined into the
 * document itself — which is also where guest documents already live.
 */
export const resolveImageSrc = async (
  file: File,
  docId: string,
  isSignedIn: boolean,
): Promise<UploadedImage> => {
  if (!isSupportedImage(file))
    throw new Error("Only PNG, JPEG, GIF and WebP images are supported");

  if (!isSignedIn) {
    const { dataUrl, width, height } = await toDataUrl(file);
    return { src: dataUrl, thumbData: null, width, height };
  }

  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("Images must be under 5MB");

  // Presigned rather than the older client-token upload: this store rejects
  // that path, and the rejection arrives without CORS headers so the browser
  // reports it as a CORS error instead of the 4xx it is.
  //
  // The store is private — it refuses a public write outright — so the returned
  // storage URL is not something an <img> can load. The document points at the
  // image route instead, which serves it to readers of this document.
  const [blob, thumbnail] = await Promise.all([
    uploadPresigned(blobPathname(docId, file.name), file, {
      access: "private",
      handleUploadUrl: "/api/upload",
      clientPayload: docId,
    }),
    toInlineThumbnail(file),
  ]);

  return {
    src: imageSrc(blob.pathname),
    thumbData: thumbnail?.thumbData ?? null,
    width: thumbnail?.width ?? null,
    height: thumbnail?.height ?? null,
  };
};
