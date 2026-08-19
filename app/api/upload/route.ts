import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import getServerSession from "@/lib/customHooks/getServerSession";
import { resolveDocumentAccess } from "@/lib/documentAccess";
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES } from "@/lib/images/constants";

/**
 * Mints the short-lived token the browser uploads with.
 *
 * Bytes go straight from the browser to Blob storage and never pass through
 * this route, which is what keeps large images clear of the request body limit
 * on a server action. That also means this handler is the only point where an
 * upload can be refused — the limits returned below travel with the token and
 * are enforced by Blob itself.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Checked explicitly because the failure is otherwise indistinguishable
        // from a rejected upload: the client only ever reports "Failed to
        // retrieve the client token", whatever went wrong here.
        if (!process.env.BLOB_READ_WRITE_TOKEN)
          throw new Error("BLOB_READ_WRITE_TOKEN is not set");

        const session = await getServerSession();
        if (!session?.id) throw new Error("Sign in to upload images");

        if (!clientPayload) throw new Error("Missing document");

        // Uploading into a document is an edit, so it answers to the same rule
        // as opening one: a collaborator, or link access being on.
        const access = await resolveDocumentAccess(clientPayload, session.id);
        if (!access) throw new Error("No access to that document");

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          // Without this, two people uploading screenshot.png collide on one
          // pathname and the second upload is rejected.
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    // Logged rather than only returned: the client library replaces whatever
    // this responds with by its own generic message, so an unlogged reason is
    // a reason nobody ever sees.
    console.error("[upload] token request failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
