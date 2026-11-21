// Chunk text is Markdown and a quoted span may have lost its emphasis marks or
// line breaks, so both sides are compared without them.
const normalize = (text: string) =>
  text.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

export const containsQuote = (content: string, quote: string) =>
  normalize(content).includes(normalize(quote));
