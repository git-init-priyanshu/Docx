import type { GoogleDoc } from "./types";

const DOCS_ENDPOINT = "https://docs.googleapis.com/v1/documents";

export class GoogleDocsFetchError extends Error {}

/**
 * Reads a document the user granted through the picker.
 *
 * The Docs API honours the `drive.file` scope for picker-granted files, so the
 * native document structure is reachable without asking for a restricted scope
 * such as `drive.readonly`.
 */
export const fetchGoogleDocument = async (fileId: string, token: string) => {
  const response = await fetch(`${DOCS_ENDPOINT}/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403)
    throw new GoogleDocsFetchError("Google denied access to that document");

  if (response.status === 404)
    throw new GoogleDocsFetchError("That document could not be found");

  if (!response.ok)
    throw new GoogleDocsFetchError("Google could not return that document");

  return (await response.json()) as GoogleDoc;
};
