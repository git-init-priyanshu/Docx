// The dashboard draws a scaled preview of each document, which needs the top of
// the document and nothing else. Storing that separately is what keeps a list of
// documents from carrying their full bodies: a long document costs the same as a
// short one to list.

// A card shows roughly twenty blocks before its overflow clips the rest, so
// this is the visible area with room to spare rather than a guess.
export const PREVIEW_NODE_LIMIT = 25;

// A single node can be arbitrarily large on its own — one long table is enough —
// so the node count alone is not a bound. Nodes are dropped from the end until
// the preview is small, since the thumbnail cuts off long before this anyway.
//
// The allowance is generous because inlined thumbnails live here: text alone
// runs about 3KB, and each image adds up to 8KB more. Even a preview at this
// ceiling is a fraction of the documents it stands in for.
const PREVIEW_MAX_BYTES = 40 * 1024;

type PreviewNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PreviewNode[];
};

const serialize = (nodes: PreviewNode[]) =>
  JSON.stringify({ type: "doc", content: nodes });

/**
 * Replaces every image with the tiny copy carried on the node itself.
 *
 * The point of inlining is that the picture arrives in the same payload as the
 * text around it and paints in the same frame — a `src` pointing anywhere, however
 * small the file, is a second request and always lands later. `thumbData` is
 * dropped afterwards, since the preview is only ever read to draw that one box.
 */
const useThumbnails = (node: PreviewNode): PreviewNode => {
  const { thumbData, ...attrs } = node.attrs ?? {};

  return {
    ...node,
    ...(node.attrs
      ? { attrs: typeof thumbData === "string" ? { ...attrs, src: thumbData } : attrs }
      : {}),
    ...(node.content ? { content: node.content.map(useThumbnails) } : {}),
  };
};

/**
 * The stored preview for a document body, or null when there is nothing to show.
 *
 * Kept beside every write of `data` rather than derived on read: a preview that
 * lags a save shows a slightly old thumbnail, which is a far better failure than
 * reading every document in full to render a grid of them.
 */
export const previewOf = (data: string | null | undefined) => {
  if (!data) return null;

  let nodes: PreviewNode[];
  try {
    nodes = (JSON.parse(data) as { content?: PreviewNode[] }).content ?? [];
  } catch {
    return null;
  }

  nodes = nodes.slice(0, PREVIEW_NODE_LIMIT).map(useThumbnails);
  while (nodes.length > 1 && serialize(nodes).length > PREVIEW_MAX_BYTES)
    nodes = nodes.slice(0, -1);

  return serialize(nodes);
};
