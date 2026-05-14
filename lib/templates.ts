const h = (level: number, text: string) => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const p = (text = "") => ({
  type: "paragraph",
  content: text ? [{ type: "text", text }] : undefined,
});

const bullet = (...items: string[]) => ({
  type: "bulletList",
  content: items.map((t) => ({
    type: "listItem",
    content: [{ type: "paragraph", content: [{ type: "text", text: t }] }],
  })),
});

const doc = (...content: object[]) =>
  JSON.stringify({ type: "doc", content });

export type Template = {
  id: string;
  label: string;
  hint: string;
  accentColor: string;
  content: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    label: "Blank document",
    hint: "Start from scratch",
    accentColor: "var(--lp-muted)",
    content: "",
  },
  {
    id: "meeting",
    label: "Meeting notes",
    hint: "Agenda · Attendees · Actions",
    accentColor: "var(--lp-accent)",
    content: doc(
      h(1, "Meeting Notes"),
      p("Date: · Facilitator:"),
      h(2, "Agenda"),
      bullet("Item 1", "Item 2", "Item 3"),
      h(2, "Attendees"),
      bullet("Name · Role", "Name · Role"),
      h(2, "Action Items"),
      bullet("[ ] Owner — Task", "[ ] Owner — Task"),
    ),
  },
  {
    id: "brief",
    label: "Project brief",
    hint: "Goals · Scope · Risks",
    accentColor: "var(--lp-leaf)",
    content: doc(
      h(1, "Project Brief"),
      h(2, "Goals"),
      p("What does success look like?"),
      h(2, "Scope"),
      p("What is in and out of scope?"),
      h(2, "Risks"),
      bullet("Risk 1", "Risk 2"),
    ),
  },
  {
    id: "rfc",
    label: "RFC",
    hint: "Problem · Proposal · Tradeoffs",
    accentColor: "var(--lp-rose)",
    content: doc(
      h(1, "RFC — Title"),
      h(2, "Problem"),
      p("Describe the problem being solved."),
      h(2, "Proposal"),
      p("Describe the proposed solution."),
      h(2, "Tradeoffs"),
      bullet("Pro: ...", "Con: ..."),
    ),
  },
];
