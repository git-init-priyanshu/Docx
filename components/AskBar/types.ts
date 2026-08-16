export type Citation = {
  id: string;
  documentId: string;
  documentName: string;
  headingPath: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  citations?: Citation[];
};

/** Stages the endpoint reports before the answer starts streaming. */
export type ChatStatus = "idle" | "searching" | "ranking" | "answering";

export const STATUS_LABEL: Record<Exclude<ChatStatus, "idle">, string> = {
  searching: "Searching your documents",
  ranking: "Ranking what it found",
  answering: "Writing an answer",
};

/** Deepest heading in a citation — what the reader actually wants to land on. */
export const sectionOf = (headingPath: string) =>
  headingPath.split(" > ").pop() ?? "";
