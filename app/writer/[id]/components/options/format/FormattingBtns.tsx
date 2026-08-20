import type { Editor } from "@tiptap/react";

import { formattingBtns } from "./textEditorOptions";

type FormattingBtnsPropType = {
  editor: Editor | null;
  isBubbleMenuBtn: boolean;
};
export default function FormattingBtns({
  editor,
  isBubbleMenuBtn,
}: FormattingBtnsPropType) {
  return (
    <div
      className={`flex w-fit cursor-pointer rounded ${isBubbleMenuBtn ? "gap-0.5" : "border col-span-6 sm:col-span-4 lg:col-span-3 lg:mb-0"}`}
    >
      {formattingBtns.map(({ func, name, Icon }, i) => {
        const isActive = editor?.isActive(name);
        return (
          <button
            key={name}
            onClick={() =>
              (editor?.chain().focus() as Record<string, any> | undefined)
                ?.[func]?.()
                .run()
            }
            aria-pressed={isActive}
            className={`${
              isActive
                ? "bg-[color-mix(in_oklab,var(--lp-accent)_18%,transparent)] text-[var(--lp-accent)]"
                : "bg-transparent text-[var(--lp-ink)] hover:bg-[var(--lp-paper-2)]"
            } transition-colors ${
              isBubbleMenuBtn
                ? "flex h-8 w-8 items-center justify-center rounded-md"
                : `p-2 rounded ${i === formattingBtns.length - 1 ? "border-none" : "border-r"}`
            }`}
          >
            <Icon size={isBubbleMenuBtn ? 15 : 18} />
          </button>
        );
      })}
    </div>
  );
}
