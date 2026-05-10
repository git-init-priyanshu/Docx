"use client";

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

    case "paragraph":
      return text ? (
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
      ) : (
        <div style={{ height: 10, marginBottom: 6 }} />
      );

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
      nodes = (parsed.content ?? []).slice(0, 10);
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
          width: "340%",
          padding: "0 20px",
          transform: "scale(0.4)",
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
