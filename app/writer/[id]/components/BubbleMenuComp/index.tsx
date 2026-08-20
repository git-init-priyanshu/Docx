import { useCallback, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { isTextSelection } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import { toast } from "sonner";

import AskAI from "./AskAI";
import GeneratedText from "./GeneratedText";
import ColorHighlight from "../options/format/ColorHighlight";
import FormattingBtns from "../options/format/FormattingBtns";
import { generateText } from "../../actions";
import { generateTextOptions } from "./generateTextConfig";

type BubbleMenuPropType = {
  editor: Editor | null;
  scrollTarget: HTMLElement | null;
  onAuthRequired: () => void;
};

export default function BubbleMenuComp({
  editor,
  scrollTarget,
  onAuthRequired,
}: BubbleMenuPropType) {
  const [isAiActive, setIsAiActive] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [generativeTextResult, setGenerativeTextResult] = useState("");
  const [lastOption, setLastOption] = useState<generateTextOptions | null>(null);
  const [lastLanguage, setLastLanguage] = useState<string | undefined>(undefined);

  const runGeneration = async (
    option: generateTextOptions,
    language?: string,
  ) => {
    if (!editor) return;

    // Capture the selected text from tiptap, not the DOM. Bubble menu /
    // dropdown interactions can collapse window.getSelection() before we
    // read it.
    const { from, to, empty } = editor.state.selection;
    if (empty) return toast.error("Select some text first");
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    if (!selectedText) return toast.error("Select some text first");

    setLastOption(option);
    setLastLanguage(language);
    setIsAiActive(true);
    setIsGeneratingText(true);
    setGenerativeTextResult("");

    const result = await generateText(option, selectedText, language);
    setIsGeneratingText(false);
    if (!result.success) {
      setIsAiActive(false);
      return toast.error(result.error);
    }
    setGenerativeTextResult(result.data || "");
  };

  const tryAgain = () => {
    if (!lastOption) return;
    runGeneration(lastOption, lastLanguage);
  };

  // These three are compared by identity: the component dispatches a
  // ProseMirror transaction to re-configure the plugin whenever any of them
  // changes, so fresh literals would mean a transaction on every render.
  const appendTo = useCallback(() => document.body, []);

  const options = useMemo(
    () => ({
      placement: "top" as const,
      offset: 8,
      strategy: "fixed" as const,
      // The editor scrolls inside a div rather than the window, which is what
      // the plugin watches by default.
      ...(scrollTarget ? { scrollTarget } : {}),
    }),
    [scrollTarget],
  );

  // Only a run of selected text gets a formatting toolbar.
  //
  // Testing `!selection.empty` alone was not enough: dragging a block makes a
  // NodeSelection, which is not empty, so the menu appeared over a drag that
  // had selected no text. The plugin does hide itself on `dragstart`, but only
  // listens on the editor's own DOM, and the drag handle is a separate element
  // portalled outside it — so that never fires here.
  //
  // The `isAiActive` branch comes first because the AI panel replaces the
  // toolbar in place, and has to survive the editor losing focus to the
  // dropdown that started the generation.
  const shouldShow = useCallback(
    ({
      editor: current,
      state,
      from,
      to,
    }: {
      editor: Editor;
      state: EditorState;
      from: number;
      to: number;
    }) => {
      if (isAiActive) return true;
      if (!current.isEditable) return false;

      const { selection } = state;
      if (selection.empty || !isTextSelection(selection)) return false;

      return state.doc.textBetween(from, to, " ").trim().length > 0;
    },
    [isAiActive],
  );

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      // Rendered into the body so the toolbar is never clipped by the scroll
      // container, and positioned with `fixed` to match.
      appendTo={appendTo}
      options={options}
      shouldShow={shouldShow}
      // Scroll is wired to the same debounced handler as window resize, which
      // is trailing-edge — at the 60ms default the menu sits still through a
      // scroll and only catches up once it stops. Zero keeps the callback but
      // drops the wait, so it repositions per scroll event.
      resizeDelay={0}
      className="z-50"
    >
      {isAiActive ? (
        <GeneratedText
          editor={editor}
          setIsAiActive={setIsAiActive}
          isGeneratingText={isGeneratingText}
          generativeTextResult={generativeTextResult}
          setGenerativeTextResult={setGenerativeTextResult}
          onTryAgain={tryAgain}
        />
      ) : (
        <div className="flex items-center gap-0.5 rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] p-1 text-[var(--lp-ink)] shadow-lg">
          <AskAI
            hasPrevious={!!lastOption}
            onGenerate={runGeneration}
            onAuthRequired={onAuthRequired}
          />
          <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--lp-border)]" />
          <FormattingBtns editor={editor} isBubbleMenuBtn={true} />
          <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--lp-border)]" />
          <ColorHighlight editor={editor} isBubbleMenuBtn={true} />
        </div>
      )}
    </BubbleMenu>
  );
}
