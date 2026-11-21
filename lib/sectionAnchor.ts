/** URL fragment for a heading, shared by headings and the links that target them. */
export const sectionAnchor = (heading: string) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
