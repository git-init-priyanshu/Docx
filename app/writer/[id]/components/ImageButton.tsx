"use client";

import { useRef } from "react";
import { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

import { ACCEPT_ATTRIBUTE } from "@/lib/images/constants";

type ImageButtonProps = {
  editor: Editor | null;
};

export default function ImageButton({ editor }: ImageButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0)
            editor?.chain().focus().insertImageFiles(files).run();
          // Cleared so picking the same file twice in a row still fires.
          event.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        title="Insert image"
        aria-label="Insert image"
        className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 bg-transparent text-[var(--lp-ink)] transition-colors hover:bg-[var(--lp-border)]"
      >
        <ImagePlus className="w-4 h-4" />
      </button>
    </>
  );
}
