import type { DocumentSource } from "@prisma/client";

/**
 * A document as the dashboard needs it: enough to draw a card, no more.
 *
 * The same shape is produced three ways — the server component's first paint,
 * the `GetAllDocs` action behind SWR, and localStorage for guests — so it lives
 * here rather than being restated at each one, where the three drift apart.
 */
export type DocSummary = {
  id: string;
  name: string;
  // The top of the document, not the document. Nothing on a dashboard needs the
  // body, and sending it made listing cost whatever people had written.
  preview: string | null;
  updatedAt: Date;
  // Absent on guest documents, which are only ever created locally.
  source?: DocumentSource;
  createdBy: { id: string; name: string; picture: string | null };
  users: { user: { id: string; name: string; picture: string | null } }[];
};
