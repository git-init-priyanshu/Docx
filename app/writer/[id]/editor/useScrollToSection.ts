"use client";

// Scrolls to the heading named by `?section=`, which is how a chat citation
// lands the reader on the passage it quoted rather than the top of a long
// document.
//
// Matched by heading text rather than a stored position: a collaborative
// document is edited between indexing and clicking, and any offset recorded at
// index time would point somewhere arbitrary by the time it is used. A renamed
// heading simply finds nothing and leaves the reader at the top.

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Editor as TiptapEditor } from "@tiptap/core";

const HIGHLIGHT_MS = 1600;

export function useScrollToSection(editor: TiptapEditor | null, ready: boolean) {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!editor || !ready || !section) return;
    if (handledRef.current === section) return;
    handledRef.current = section;

    const target = section.trim().toLowerCase();
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".tiptap h1, .tiptap h2, .tiptap h3, .tiptap h4, .tiptap h5, .tiptap h6",
      ),
    );

    const match = headings.find(
      (heading) => (heading.textContent ?? "").trim().toLowerCase() === target,
    );
    if (!match) return;

    match.scrollIntoView({ behavior: "smooth", block: "center" });

    match.style.transition = "background-color 300ms ease";
    match.style.backgroundColor = "var(--lp-accent-soft)";
    const timer = setTimeout(() => {
      match.style.backgroundColor = "";
    }, HIGHLIGHT_MS);

    return () => clearTimeout(timer);
  }, [editor, ready, section]);
}
