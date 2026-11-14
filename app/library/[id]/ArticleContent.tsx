import { Fragment, type ReactNode } from "react";
import type { TipTapDoc, TipTapNode } from "@/lib/tiptap/markdown";
import { sectionAnchor } from "@/lib/sectionAnchor";

const plainText = (node: TipTapNode): string =>
  node.text ?? node.content?.map(plainText).join("") ?? "";

const renderChildren = (node: TipTapNode): ReactNode =>
  node.content?.map((child, i) => renderNode(child, i));

function renderNode(node: TipTapNode, key: number): ReactNode {
  switch (node.type) {
    case "text": {
      let out: ReactNode = node.text;
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") out = <strong>{out}</strong>;
        else if (mark.type === "italic") out = <em>{out}</em>;
        else if (mark.type === "code") out = <code>{out}</code>;
      }
      return <Fragment key={key}>{out}</Fragment>;
    }
    case "hardBreak":
      return <br key={key} />;
    case "heading": {
      const level = Math.min(6, Math.max(2, Number(node.attrs?.level) || 2));
      const Tag = `h${level}` as "h2";
      return (
        <Tag
          key={key}
          id={sectionAnchor(plainText(node))}
          className="scroll-mt-24"
        >
          {renderChildren(node)}
        </Tag>
      );
    }
    case "paragraph":
      return <p key={key}>{renderChildren(node)}</p>;
    case "bulletList":
      return <ul key={key}>{renderChildren(node)}</ul>;
    case "orderedList":
      return <ol key={key}>{renderChildren(node)}</ol>;
    case "listItem":
      return (
        <li key={key}>
          {node.content?.map((child, i) =>
            child.type === "paragraph"
              ? renderChildren(child)
              : renderNode(child, i),
          )}
        </li>
      );
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node)}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{plainText(node)}</code>
        </pre>
      );
    case "table":
      return (
        <div key={key} className="overflow-x-auto">
          <table>
            <tbody>{renderChildren(node)}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{renderChildren(node)}</tr>;
    case "tableHeader":
      return <th key={key}>{renderChildren(node)}</th>;
    case "tableCell":
      return <td key={key}>{renderChildren(node)}</td>;
    default:
      return <Fragment key={key}>{renderChildren(node)}</Fragment>;
  }
}

export default function ArticleContent({ data }: { data: string }) {
  let doc: TipTapDoc;
  try {
    doc = JSON.parse(data);
  } catch {
    return null;
  }

  return (
    <div className="prose max-w-none text-[var(--lp-ink)] prose-headings:text-[var(--lp-ink)] prose-a:text-[var(--lp-accent-ink)] prose-strong:text-[var(--lp-ink)] prose-th:text-[var(--lp-ink)] prose-blockquote:text-[var(--lp-ink)] prose-blockquote:border-[var(--lp-border)] prose-code:text-[var(--lp-ink)] prose-pre:bg-[var(--lp-card)] prose-pre:text-[var(--lp-ink)] prose-hr:border-[var(--lp-border)] prose-th:border-[var(--lp-border)] prose-td:border-[var(--lp-border)] prose-thead:border-[var(--lp-border)] prose-tr:border-[var(--lp-border)] prose-li:marker:text-[var(--lp-muted)]">
      {doc.content?.map((node, i) => renderNode(node, i))}
    </div>
  );
}
