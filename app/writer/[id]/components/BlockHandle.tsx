"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { GripVertical, Plus } from "lucide-react";
import type { Node } from "@tiptap/pm/model";

type BlockHandleProps = {
  editor: Editor | null;
};

const BUTTON_CLASS =
  "flex h-6 w-5 items-center justify-center rounded text-[var(--lp-muted)] transition-colors hover:bg-[var(--lp-paper-2)] hover:text-[var(--lp-ink)]";

/**
 * The gutter controls that appear beside the block under the pointer.
 *
 * The plus inserts an empty paragraph after the hovered block and opens the
 * slash menu on it, which is the only way to reach the block list without
 * typing — the handle is otherwise drag-only.
 */
export default function BlockHandle({ editor }: BlockHandleProps) {
  const [hovered, setHovered] = useState<{ node: Node; pos: number } | null>(
    null,
  );

  if (!editor) return null;

  const insertBelow = () => {
    if (!hovered) return;
    const after = hovered.pos + hovered.node.nodeSize;

    editor
      .chain()
      .focus()
      .insertContentAt(after, { type: "paragraph" })
      .setTextSelection(after + 1)
      .insertContent("/")
      .run();
  };

  return (
    <DragHandle
      editor={editor}
      onNodeChange={({ node, pos }) => setHovered(node ? { node, pos } : null)}
      className="lp-block-handle flex items-center gap-0.5 pr-2"
    >
      <button
        type="button"
        onClick={insertBelow}
        title="Insert block below"
        aria-label="Insert block below"
        className={BUTTON_CLASS}
      >
        <Plus className="h-4 w-4" />
      </button>
      <span
        title="Drag to move"
        aria-label="Drag to move"
        className={`${BUTTON_CLASS} cursor-grab active:cursor-grabbing`}
      >
        <GripVertical className="h-4 w-4" />
      </span>
    </DragHandle>
  );
}
