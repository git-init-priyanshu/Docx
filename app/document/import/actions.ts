"use server";

import { CreateNewDocument } from "../components/Header/actions";
import { CreateDocVersion } from "@/app/writer/[id]/versions/actions";

/**
 * Creates a document from content converted in the browser.
 *
 * A version snapshot is written straight away so history has an "as imported"
 * baseline to restore to. Indexing is deliberately left to the caller: it takes
 * seconds, and work started but not awaited inside a server action is not
 * guaranteed to survive the response on a serverless host.
 */
export const ImportDocument = async (name: string, data: string) => {
  const created = await CreateNewDocument(data, name);
  if (!created.success || !created.data) return created;

  await CreateDocVersion(created.data.id, data);

  return created;
};
