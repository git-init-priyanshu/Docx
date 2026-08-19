"use client";

import { Editor } from "@tiptap/react";
import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ArrowLeftToLine,
  Heading,
  Table as TableIcon,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";

type TableControlsProps = {
  editor: Editor | null;
};

const ITEM_CLASS =
  "gap-2 text-[13px] focus:bg-[var(--lp-paper-2)] focus:text-[var(--lp-ink)]";

export default function TableControls({ editor }: TableControlsProps) {
  const isInTable = editor?.isActive("table") ?? false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          title="Table"
          aria-label="Table"
          className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors shrink-0 ${
            isInTable
              ? "bg-[color-mix(in_oklab,var(--lp-accent)_18%,transparent)] text-[var(--lp-accent)]"
              : "bg-transparent text-[var(--lp-ink)] hover:bg-[var(--lp-border)]"
          }`}
        >
          <TableIcon className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[210px] border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)]"
      >
        <DropdownMenuItem
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className={ITEM_CLASS}
        >
          <TableIcon className="w-4 h-4 text-[var(--lp-muted)]" />
          Insert 3 × 3 table
        </DropdownMenuItem>

        {isInTable && (
          <>
            <DropdownMenuSeparator className="bg-[var(--lp-border)]" />

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().addRowBefore().run()}
              className={ITEM_CLASS}
            >
              <ArrowUpToLine className="w-4 h-4 text-[var(--lp-muted)]" />
              Row above
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              className={ITEM_CLASS}
            >
              <ArrowDownToLine className="w-4 h-4 text-[var(--lp-muted)]" />
              Row below
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().addColumnBefore().run()}
              className={ITEM_CLASS}
            >
              <ArrowLeftToLine className="w-4 h-4 text-[var(--lp-muted)]" />
              Column left
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              className={ITEM_CLASS}
            >
              <ArrowRightToLine className="w-4 h-4 text-[var(--lp-muted)]" />
              Column right
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[var(--lp-border)]" />

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
              className={ITEM_CLASS}
            >
              <Heading className="w-4 h-4 text-[var(--lp-muted)]" />
              Toggle header row
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[var(--lp-border)]" />

            <DropdownMenuItem
              onClick={() => editor?.chain().focus().deleteRow().run()}
              className={ITEM_CLASS}
            >
              <Trash2 className="w-4 h-4 text-[var(--lp-muted)]" />
              Delete row
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              className={ITEM_CLASS}
            >
              <Trash2 className="w-4 h-4 text-[var(--lp-muted)]" />
              Delete column
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().deleteTable().run()}
              className={`${ITEM_CLASS} text-[var(--lp-rose)] focus:text-[var(--lp-rose)]`}
            >
              <Trash2 className="w-4 h-4" />
              Delete table
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
