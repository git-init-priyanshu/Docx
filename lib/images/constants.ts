// Shared by the browser and by the upload route. Kept apart from both so the
// client never imports the route module, which would pull Prisma and the
// session helpers into the bundle.

export const ALLOWED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ACCEPT_ATTRIBUTE = ALLOWED_CONTENT_TYPES.join(",");
