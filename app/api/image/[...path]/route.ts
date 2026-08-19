import { NextResponse } from "next/server";
import { issueSignedToken, presignUrl } from "@vercel/blob";

import getServerSession from "@/lib/customHooks/getServerSession";
import { resolveDocumentAccess } from "@/lib/documentAccess";
import { documentIdFromBlobPath } from "@/lib/images/paths";

// Long enough for a slow page to finish loading its images, short enough that a
// copied URL is worthless by the time it is pasted anywhere.
const LINK_TTL_MS = 5 * 60 * 1000;

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
    const signedToken = await issueSignedToken({
      // Explicit for the same reason as the upload route: left out, the SDK
      // prefers VERCEL_OIDC_TOKEN whenever BLOB_STORE_ID is set, which fails
      // anywhere OIDC is not enabled.
      token: process.env.BLOB_READ_WRITE_TOKEN,
      pathname,
      operations: ["get"],
      validUntil: Date.now() + LINK_TTL_MS,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "get",
      pathname,
      access: "private",
    });

    return NextResponse.redirect(presignedUrl, {
      status: 307,
      // The destination expires, so a cached redirect would outlive what it
      // points at. Blob sets its own caching on the image behind it.
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("[image] could not sign a read for", pathname, error);
    return new NextResponse(null, { status: 500 });
  }
}
