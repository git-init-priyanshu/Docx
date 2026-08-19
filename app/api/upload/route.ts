import { NextResponse } from "next/server";
import { issueSignedToken } from "@vercel/blob";
import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";

import getServerSession from "@/lib/customHooks/getServerSession";
import { resolveDocumentAccess } from "@/lib/documentAccess";
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES } from "@/lib/images/constants";

/**
 * Issues the short-lived presigned URL the browser uploads with.
 *
 * Bytes go straight from the browser to Blob storage and never pass through
 * this route, which keeps large images clear of the 4.5MB request body limit a
 * serverless function has. That also makes this handler the only point where an
 * upload can be refused — the constraints below are signed into the token and
 * enforced by Blob itself rather than taken on trust.
 *
 * This is the presigned flow rather than `handleUpload`. Stores created since
 * Vercel moved to presigned uploads reject the older client-token path outright,
 * and because the rejection comes back without CORS headers the browser reports
 * it as a CORS failure rather than as the 4xx it actually is.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadPresignedBody;

  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        // Checked explicitly because the failure is otherwise indistinguishable
        // from a rejected upload: whatever goes wrong here, the client reports
        // only that it could not get a token.
        if (!process.env.BLOB_READ_WRITE_TOKEN)
          throw new Error("BLOB_READ_WRITE_TOKEN is not set");

        const session = await getServerSession();
        if (!session?.id) throw new Error("Sign in to upload images");

        if (!clientPayload) throw new Error("Missing document");

        // Uploading into a document is an edit, so it answers to the same rule
        // as opening one: a collaborator, or link access being on.
        const access = await resolveDocumentAccess(clientPayload, session.id);
        if (!access) throw new Error("No access to that document");

        const token = await issueSignedToken({
          // Passed explicitly so the credential does not depend on the
          // environment: left out, the SDK reaches for VERCEL_OIDC_TOKEN
          // whenever BLOB_STORE_ID is set, which fails anywhere OIDC is not
          // enabled — local development included.
          token: process.env.BLOB_READ_WRITE_TOKEN,
          pathname,
          operations: ["put"],
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
        });

        return {
          token,
          urlOptions: {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            // Without this, two people uploading screenshot.png collide on one
            // pathname and the second upload is rejected.
            addRandomSuffix: true,
          },
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    // Logged rather than only returned: the client library replaces whatever
    // this responds with by its own generic message, so an unlogged reason is
    // a reason nobody ever sees.
    console.error("[upload] presign request failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
