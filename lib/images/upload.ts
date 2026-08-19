import { uploadPresigned } from "@vercel/blob/client";

import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES } from "./constants";

export const isSupportedImage = (file: File) =>
  ALLOWED_CONTENT_TYPES.includes(file.type);

// Guest documents live in localStorage, which holds roughly 5MB for the whole
// origin — a handful of untouched photos would fill it. Guest images are
// re-encoded to fit, and refused outright when even that is not enough.
const GUEST_MAX_EDGE = 1280;
const GUEST_MAX_BYTES = 1024 * 1024;

const readBitmap = async (file: File) => {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("That file could not be read as an image");
  }
};

const toDataUrl = async (file: File) => {
  const bitmap = await readBitmap(file);
  const scale = Math.min(
    1,
    GUEST_MAX_EDGE / Math.max(bitmap.width, bitmap.height),
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("That image could not be processed");

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // A canvas keeps only the first frame of a GIF, so animation is lost either
  // way; PNG is kept for its transparency and everything else becomes JPEG.
  const dataUrl = canvas.toDataURL(
    file.type === "image/png" ? "image/png" : "image/jpeg",
    0.8,
  );

  if (dataUrl.length > GUEST_MAX_BYTES)
    throw new Error("Sign in to add images this large");

  return dataUrl;
};

/**
 * Resolves to the `src` an image node should carry.
 *
 * Signed-in uploads go to Blob storage and come back as a URL. Guests have no
 * session to mint an upload token with, so their images are inlined into the
 * document itself — which is also where guest documents already live.
 */
export const resolveImageSrc = async (
  file: File,
  docId: string,
  isSignedIn: boolean,
) => {
  if (!isSupportedImage(file))
    throw new Error("Only PNG, JPEG, GIF and WebP images are supported");

  if (!isSignedIn) return toDataUrl(file);

  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error("Images must be under 5MB");

  // Presigned rather than the older client-token upload: this store rejects
  // that path, and the rejection arrives without CORS headers so the browser
  // reports it as a CORS error instead of the 4xx it is.
  const blob = await uploadPresigned(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: docId,
  });

  return blob.url;
};
