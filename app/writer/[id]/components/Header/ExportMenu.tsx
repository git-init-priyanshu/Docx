"use client";

import { Download, FileText, Hash, Printer } from "lucide-react";
import { type Editor as TiptapEditor } from "@tiptap/core";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { toMarkdown, toPlainText } from "../../editor/exportMarkdown";

type ExportMenuProps = {
  editor: TiptapEditor | null;
  fallbackData: string;
  name: string;
};

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportMenu({
  editor,
  fallbackData,
  name,
}: ExportMenuProps) {
  // Prefer the live editor JSON so exports reflect unsaved edits.
  const getData = () =>
    editor ? JSON.stringify(editor.getJSON()) : fallbackData;
  const baseName = name.trim() || "Untitled";

  const exportMarkdown = () => {
    downloadFile(`${baseName}.md`, toMarkdown(getData()), "text/markdown");
  };

  const exportText = () => {
    downloadFile(`${baseName}.txt`, toPlainText(getData()), "text/plain");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[var(--lp-border)] text-[12.5px] font-medium text-[var(--lp-ink)] transition-colors hover:bg-[var(--lp-border)]"
          aria-label="Export document"
        >
          <Download className="w-3.5 h-3.5 text-[var(--lp-accent)]" />
          <span>Export</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[220px] border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)]"
      >
        <DropdownMenuItem
          onClick={exportMarkdown}
          className="gap-2 text-[13px] focus:bg-[var(--lp-paper-2)] focus:text-[var(--lp-ink)]"
        >
          <Hash className="w-4 h-4 text-[var(--lp-muted)]" />
          Download as Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportText}
          className="gap-2 text-[13px] focus:bg-[var(--lp-paper-2)] focus:text-[var(--lp-ink)]"
        >
          <FileText className="w-4 h-4 text-[var(--lp-muted)]" />
          Download as plain text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.print()}
          className="gap-2 text-[13px] focus:bg-[var(--lp-paper-2)] focus:text-[var(--lp-ink)]"
        >
          <Printer className="w-4 h-4 text-[var(--lp-muted)]" />
          Print / Save as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
