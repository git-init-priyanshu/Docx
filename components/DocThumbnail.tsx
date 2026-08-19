import { PREVIEW_NODE_LIMIT } from "@/lib/documents/preview";

// The preview is drawn at full size and then shrunk, which is what keeps text
// proportioned like a page instead of like small text.
const PREVIEW_SCALE = 0.4;
const PREVIEW_INSET = 20;

type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: { type: string }[];
};

function extractText(nodes: TipTapNode[] = []): string {
  return nodes
    .map(n => (n.text ?? "") + extractText(n.content))
    .join("");
}

// Images are inline nodes, so they arrive nested inside a paragraph rather than
// as blocks of their own. Pulling them out is what puts them in the preview at
// all — walking only the top level finds text and nothing else.
function collectImages(nodes: TipTapNode[] = []): TipTapNode[] {
  return nodes.flatMap(n =>
    n.type === "image" ? [n] : collectImages(n.content),
  );
}

// Tall enough that a portrait image cannot fill the whole preview on its own,
// loose enough that it is not what decides an image's size.
const IMAGE_MAX_HEIGHT = 420;

function ThumbnailImage({ node }: { node: TipTapNode }) {
  const src = node.attrs?.src as string | undefined;
  if (!src) return null;

  // An editor lays an image out at its own width, capped to the column, so the
  // preview does the same.
  //
  // Without a recorded width the browser is left to size the image itself,
  // which is right for exactly the case that lacks one: an image predating
  // inline thumbnails still points at the original, so its natural size is the
  // size the document gives it. A recorded width is only needed once `src` is a
  // 128px stand-in that would otherwise render as a stamp.
  const width = node.attrs?.width as number | undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      // Inlined thumbnails cost no request, but an image from before they
      // existed still does, and only the cards someone scrolled to should pay.
      loading="lazy"
      decoding="async"
      style={{
        ...(width ? { width: `min(${width}px, 100%)` } : { maxWidth: "100%" }),
        height: "auto",
        maxHeight: IMAGE_MAX_HEIGHT,
        objectFit: "contain",
        objectPosition: "left top",
        borderRadius: 4,
        marginBottom: 8,
        display: "block",
      }}
    />
  );
}

function ThumbnailNode({ node }: { node: TipTapNode }) {
  const text = extractText(node.content);

  switch (node.type) {
    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const sizes = { 1: 28, 2: 22, 3: 18, 4: 16, 5: 14, 6: 13 };
      return (
        <div
          style={{
            fontSize: sizes[level as keyof typeof sizes] ?? 16,
            fontWeight: 700,
            color: "var(--lp-ink)",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {text || <span style={{ opacity: 0.25 }}>Untitled</span>}
        </div>
      );
    }

    case "paragraph": {
      const images = collectImages(node.content);
      if (!text && images.length === 0)
        return <div style={{ height: 10, marginBottom: 6 }} />;

      return (
        <>
          {text && (
            <div
              style={{
                fontSize: 13,
                color: "var(--lp-ink)",
                opacity: 0.8,
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              {text}
            </div>
          )}
          {images.map((image, i) => (
            <ThumbnailImage key={i} node={image} />
          ))}
        </>
      );
    }

    case "bulletList":
    case "orderedList":
      return (
        <div style={{ marginBottom: 6 }}>
          {(node.content ?? []).slice(0, 4).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
              <span style={{ color: "var(--lp-muted)", fontSize: 13, flexShrink: 0 }}>
                {node.type === "orderedList" ? `${i + 1}.` : "•"}
              </span>
              <span style={{ fontSize: 13, color: "var(--lp-ink)", opacity: 0.8 }}>
                {extractText(item.content)}
              </span>
            </div>
          ))}
        </div>
      );

    case "blockquote":
      return (
        <div
          style={{
            borderLeft: "3px solid var(--lp-accent)",
            paddingLeft: 10,
            marginBottom: 8,
            color: "var(--lp-muted)",
            fontSize: 13,
          }}
        >
          {extractText(node.content)}
        </div>
      );

    case "image":
      return <ThumbnailImage node={node} />;

    // Only the top-left corner survives at this scale, so the preview shows
    // enough rows and columns to read as a table and stops there.
    case "table":
      return (
        <div style={{ marginBottom: 8, display: "grid", gap: 1 }}>
          {(node.content ?? []).slice(0, 4).map((row, r) => (
            <div key={r} style={{ display: "flex", gap: 1 }}>
              {(row.content ?? []).slice(0, 4).map((cell, c) => (
                <div
                  key={c}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "1px solid var(--lp-border)",
                    padding: "2px 4px",
                    fontSize: 11,
                    lineHeight: 1.3,
                    color: "var(--lp-ink)",
                    opacity: cell.type === "tableHeader" ? 1 : 0.75,
                    fontWeight: cell.type === "tableHeader" ? 600 : 400,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {extractText(cell.content)}
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case "codeBlock":
      return (
        <div
          style={{
            background: "var(--lp-paper-2)",
            borderRadius: 4,
            padding: "6px 8px",
            fontSize: 11,
            fontFamily: "monospace",
            color: "var(--lp-muted)",
            marginBottom: 8,
          }}
        >
          {extractText(node.content)}
        </div>
      );

    default:
      return null;
  }
}

function EmptyPlaceholder() {
  return (
    <div style={{ paddingTop: 4 }}>
      {[70, 90, 55, 80, 40].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? 14 : 9,
            width: `${w}%`,
            background: "var(--lp-border)",
            borderRadius: 3,
            marginBottom: i === 0 ? 14 : 8,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

type DocThumbnailProps = {
  data: string | null | undefined;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function DocThumbnail({
  data,
  accentColor,
  className,
  style,
}: DocThumbnailProps) {
  let nodes: TipTapNode[] = [];
  try {
    if (data) {
      const parsed = JSON.parse(data) as { content?: TipTapNode[] };
      nodes = (parsed.content ?? []).slice(0, PREVIEW_NODE_LIMIT);
    }
  } catch {
    // malformed JSON — fall through to empty state
  }

  return (
    <div
      className={className}
      style={{
        background: "var(--lp-paper-2)",
        overflow: "hidden",
        position: "relative",
        padding: accentColor ? "16px 10px 10px" : "10px",
        ...style,
      }}
    >
      {/* Accent stripe */}
      {accentColor && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: accentColor,
            zIndex: 1,
          }}
        />
      )}

      {/* Scaled document preview */}
      <div
        style={{
          // Rendered at full size and shrunk, so the width has to be the exact
          // inverse of the scale. Anything wider hangs off the right edge and
          // is clipped, which is what left the padding looking lopsided.
          width: `${100 / PREVIEW_SCALE}%`,
          padding: `0 ${PREVIEW_INSET}px`,
          transform: `scale(${PREVIEW_SCALE})`,
          transformOrigin: "top left",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {nodes.length > 0
          ? nodes.map((node, i) => <ThumbnailNode key={i} node={node} />)
          : <EmptyPlaceholder />}
      </div>
    </div>
  );
}
