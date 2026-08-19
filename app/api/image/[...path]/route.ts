import { NextResponse } from "next/server";

import getServerSession from "@/lib/customHooks/getServerSession";
import { resolveDocumentAccess } from "@/lib/documentAccess";
import { documentIdFromBlobPath } from "@/lib/images/paths";
import { IMAGE_LINK_TTL_MS, signedImageUrl } from "@/lib/images/signedRead";

// Kept under the life of the URL it points at, so a cached redirect can never
// hand out one that has already expired. The cost is that access revoked in
// this window is not felt until it lapses.
const REDIRECT_CACHE_SECONDS = Math.floor(IMAGE_LINK_TTL_MS / 1000) - 60;

/**
 * Serves an uploaded image to whoever is allowed to read the document it
 * belongs to.
 *
 * The Blob store is private, so its URLs answer 403 to an unauthenticated
 * request — and a browser loading an <img> is always unauthenticated. Rather
 * than work around that, this leans on it: the image is exactly as private as
 * the document, which a public blob URL could never be, since anyone holding
 * one could read it however `linkAccess` was set.
 *
 * The bytes are not streamed through here. This redirects to a short-lived
 * presigned URL, so the browser fetches from Blob directly and the function
 * only decides whether it may.
 */
export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } },
) {
  const documentId = documentIdFromBlobPath(params.path);
  if (!documentId) return new NextResponse(null, { status: 404 });

  const session = await getServerSession();
  const access = await resolveDocumentAccess(documentId, session?.id ?? "");
  if (!access) return new NextResponse(null, { status: 403 });

  const pathname = params.path.join("/");

  try {
    return NextResponse.redirect(await signedImageUrl(pathname), {
      status: 307,
      headers: {
        "Cache-Control": `private, max-age=${REDIRECT_CACHE_SECONDS}`,
      },
    });
  } catch (error) {
    console.error("[image] could not sign a read for", pathname, error);
    return new NextResponse(null, { status: 500 });
  }
}
