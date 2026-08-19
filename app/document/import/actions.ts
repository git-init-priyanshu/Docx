"use server";

import { randomUUID } from "node:crypto";

import { CreateNewDocument } from "../components/Header/actions";
import { CreateDocVersion } from "@/app/writer/[id]/versions/actions";
import { rehostImages } from "@/lib/googleDocs/rehostImages";
import type { TiptapNode } from "@/lib/googleDocs/toTiptap";

/**
 * Creates a document from content converted in the browser.
 *
 * Images arrive pointing at Google's short-lived `contentUri`, so they are
 * copied into Blob storage here — before the document is written, so nothing is
 * ever saved holding a link that expires within the hour.
 *
 * A version snapshot follows straight away so history has an "as imported"
 * baseline to restore to. Indexing is deliberately left to the caller: it takes
 * seconds, and work started but not awaited inside a server action is not
 * guaranteed to survive the response on a serverless host.
 */
export const ImportDocument = async (name: string, data: string) => {
  let doc: TiptapNode;
  try {
    doc = JSON.parse(data) as TiptapNode;
  } catch {
    return { success: false as const, error: "That document could not be read" };
  }

  // Decided here rather than by the database because images are stored under
  // it and they are copied before the document row exists. An import that then
  // fails to save leaves those images behind, which costs a little storage —
  // preferable to writing a document whose pictures expire within the hour.
  const documentId = randomUUID();

  const rehosted = await rehostImages(doc, documentId);
  const stored = JSON.stringify(rehosted.doc);

  const created = await CreateNewDocument(stored, name, {
    id: documentId,
    source: "GOOGLE_DOCS",
  });
  if (!created.success || !created.data)
    return { ...created, failedImages: rehosted.failed };

  await CreateDocVersion(created.data.id, stored);

  return { ...created, failedImages: rehosted.failed };
};
