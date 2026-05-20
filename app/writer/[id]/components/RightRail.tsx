"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";

import useClientSession from "@/lib/customHooks/useClientSession";
import { generateText } from "../actions";
import { generateTextOptions } from "./BubbleMenuComp/generateTextConfig";

type AIAction = {
  label: string;
  option: generateTextOptions;
  // When true, clicking opens the palette instead of running inline (e.g.
  // translate needs a language picker).
  viaPalette?: boolean;
};

const AI_ACTIONS: AIAction[] = [
  { label: "Tighten", option: generateTextOptions.MAKE_SHORTER },
  { label: "Expand", option: generateTextOptions.MAKE_LONGER },
  { label: "Rephrase", option: generateTextOptions.IMPROVE_WRITING },
  { label: "Translate", option: generateTextOptions.TRANSLATE, viaPalette: true },
  { label: "Simpler", option: generateTextOptions.SIMPLIFY_LANGUAGE },
  { label: "Counter-argue", option: generateTextOptions.COUNTER_ARGUMENT },
];

type RightRailProps = {
  editor: Editor | null;
  onAskTranslate: () => void;
  onAuthRequired: () => void;
};

export default function RightRail({
  editor,
  onAskTranslate,
  onAuthRequired,
}: RightRailProps) {
  const session = useClientSession();
  const [tab, setTab] = useState<"ai" | "outline" | "history">("ai");
  const [selectionPreview, setSelectionPreview] = useState("");
  const [runningAction, setRunningAction] = useState<generateTextOptions | null>(null);

  // Mirror the editor's selection into a small preview shown above the AI
  // action grid so the user knows what's about to be rewritten.
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { from, to, empty } = editor.state.selection;
      if (empty) {
        setSelectionPreview("");
        return;
      }
      const text = editor.state.doc.textBetween(from, to, " ").trim();
      setSelectionPreview(text);
    };
    update();
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const outline = editor ? collectHeadings(editor) : [];

  const handleAction = async (action: AIAction) => {
    if (!editor) return;
    if (session !== null && !session.id) {
      onAuthRequired();
      return;
    }
    if (!selectionPreview) {
      toast.error("Select some text first");
      return;
    }
    if (action.viaPalette) {
      onAskTranslate();
      return;
    }
    setRunningAction(action.option);
    const res = await generateText(action.option, selectionPreview);
    setRunningAction(null);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    editor.chain().focus().insertContent(res.data || "").run();
  };

  return (
    <aside
      className="w-[280px] border-l hidden xl:flex flex-col shrink-0 bg-[var(--lp-paper-2)] border-[var(--lp-border)]"
    >
      {/* Tab headers */}
      <div className="h-[52px] border-b flex shrink-0 border-[var(--lp-border)]">
        {(["ai", "outline", "history"] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 text-[12.5px] font-medium relative transition-colors capitalize ${
              tab === id ? "text-[var(--lp-ink)]" : "text-[var(--lp-muted)]"
            }`}
          >
            {id === "ai" ? "AI" : id.charAt(0).toUpperCase() + id.slice(1)}
            {tab === id && (
              <span className="absolute left-4 right-4 bottom-0 h-0.5 rounded-full bg-[var(--lp-accent)]" />
            )}
          </button>
        ))}
      </div>

      {/* AI tab */}
      {tab === "ai" && (
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="rounded-lg border p-3 border-[var(--lp-border)] bg-[var(--lp-card)]">
            <div className="font-mono text-[10px] mb-1 text-[var(--lp-muted)]">
              SELECTION
            </div>
            {selectionPreview ? (
              <div className="text-[12.5px] leading-relaxed text-[var(--lp-ink)] line-clamp-3">
                {selectionPreview}
              </div>
            ) : (
              <div className="text-[12.5px] text-[var(--lp-muted)]">
                Select text to use AI
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AI_ACTIONS.map((action) => {
              const isRunning = runningAction === action.option;
              const disabled = !selectionPreview || runningAction !== null;
              return (
                <button
                  key={action.label}
                  onClick={() => handleAction(action)}
                  disabled={disabled}
                  className="text-left text-[12px] px-2.5 py-2 rounded-md border transition-colors hover:bg-[var(--lp-paper-2)] disabled:opacity-50 disabled:cursor-not-allowed border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)]"
                >
                  {isRunning ? "Generating…" : action.label}
                </button>
              );
            })}
          </div>

          <div
            className="rounded-lg border p-3 border-[var(--lp-border)] bg-[color-mix(in_oklab,var(--lp-accent)_8%,var(--lp-card))]"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--lp-accent)]" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--lp-accent)]">
                DocX AI
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--lp-ink)]">
              Select text in the editor, then choose an action to insert an AI rewrite at your cursor.
            </p>
          </div>
        </div>
      )}

      {/* Outline tab */}
      {tab === "outline" && (
        <div className="p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-[12.5px] font-medium text-[var(--lp-ink)]">
            Document outline
          </div>
          {outline.length === 0 ? (
            <p className="text-[12.5px] text-[var(--lp-muted)]">
              Add headings to your document to see an outline here.
            </p>
          ) : (
            outline.map((h, i) => (
              <button
                key={i}
                onClick={() => focusHeading(editor, h.pos)}
                className="text-left text-[12.5px] leading-snug rounded-md px-2 py-1.5 hover:bg-[var(--lp-card)] transition-colors text-[var(--lp-ink)]"
                style={{ paddingLeft: `${0.5 + (h.level - 1) * 0.75}rem` }}
              >
                {h.text || "Untitled section"}
              </button>
            ))
          )}
        </div>
      )}

      {/* History tab */}
      {tab === "history" && (
        <div className="p-4 flex flex-col gap-3">
          <p className="text-[12.5px] text-[var(--lp-muted)]">
            Document history is coming soon.
          </p>
        </div>
      )}
    </aside>
  );
}

type Heading = { level: number; text: string; pos: number };

function collectHeadings(editor: Editor): Heading[] {
  const out: Heading[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      out.push({
        level: (node.attrs.level as number) ?? 1,
        text: node.textContent,
        pos,
      });
    }
  });
  return out;
}

function focusHeading(editor: Editor | null, pos: number) {
  if (!editor) return;
  editor.chain().focus().setTextSelection(pos + 1).scrollIntoView().run();
}
