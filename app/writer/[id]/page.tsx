"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EditorContent } from "@tiptap/react";

import useClientSession from "@/lib/customHooks/useClientSession";
import AskBar from "@/components/AskBar/AskBar";
import { Editor } from "./editor";
import { useScrollToSection } from "./editor/useScrollToSection";
import Toolbar from "./components/Header/Header";
import LeftSidebar from "./components/Tabs";
import FormatBar from "./components/FormatBar";
import RightRail from "./components/RightRail";
import AskPalette from "./components/AskPalette";
import Loading from "./components/EditorLoading";
import BlockHandle from "./components/BlockHandle";
import BubbleMenuComp from "./components/BubbleMenuComp";
import LoginPromptModal from "./components/LoginPromptModal";
import { generateTextOptions } from "./components/BubbleMenuComp/generateTextConfig";

export default function WriterPage() {
  const session = useClientSession();

  const [isSaving, setIsSaving] = useState(false);
  // The bubble menu is rendered into the body, so Floating UI has to be told
  // which element actually scrolls in order to keep it anchored.
  const [scrollTarget, setScrollTarget] = useState<HTMLElement | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [askInitialOption, setAskInitialOption] = useState<generateTextOptions | undefined>(undefined);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { editor, docData, error, isLoading } = Editor({ setIsSaving });

  useScrollToSection(editor, !!docData);

  const isGuest = session !== null && !session.id;

  const sessionResolving = session === null;

  const notFound = !!error || (!sessionResolving && !isLoading && !docData);

  const isNewDoc =
    !!docData &&
    (docData.name === "Untitled Document" || docData.name === "Untitled document") &&
    (!docData.data || docData.data === "");

  const openAsk = (option?: generateTextOptions) => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    setAskInitialOption(option);
    setAskOpen(true);
  };
  const closeAsk = () => {
    setAskOpen(false);
    setAskInitialOption(undefined);
  };

  // ⌘K / Ctrl+K to open the Ask palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isGuest) { setShowLoginPrompt(true); return; }
        if (askOpen) closeAsk(); else openAsk();
      }
      if (e.key === "Escape") { closeAsk(); setShowLoginPrompt(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest, askOpen]);

  if (notFound) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-[var(--lp-paper)] text-center px-6">
        <p className="text-[var(--lp-ink)] text-lg font-medium">
          This document doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/document"
          className="rounded-md border border-[var(--lp-border)] px-4 py-2 text-sm text-[var(--lp-ink)] hover:bg-[var(--lp-card)]"
        >
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--lp-paper)]">
      <LeftSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Toolbar
          docId={docData?.id || ""}
          name={docData?.name || ""}
          data={docData?.data || ""}
          editor={editor}
          isLoading={!docData}
          isNewDoc={isNewDoc}
          isSaving={isSaving}
          onAsk={() => openAsk()}
          onAuthRequired={() => setShowLoginPrompt(true)}
        />

        <FormatBar editor={editor} onRewrite={() => openAsk()} />

        <div ref={setScrollTarget} className="flex-1 overflow-y-auto">
          <div className="relative px-4 pb-24 sm:px-8">
            {!docData ? (
              <Loading />
            ) : (
              <>
                <BubbleMenuComp
                  editor={editor}
                  scrollTarget={scrollTarget}
                  onAuthRequired={() => setShowLoginPrompt(true)}
                />
                <BlockHandle editor={editor} />
                <EditorContent editor={editor} />
              </>
            )}
          </div>
        </div>
      </main>

      <RightRail
        editor={editor}
        onAskTranslate={() => openAsk(generateTextOptions.TRANSLATE)}
        onAuthRequired={() => setShowLoginPrompt(true)}
      />

      {/* ⌘K palette */}
      <AskPalette
        open={askOpen}
        onClose={closeAsk}
        editor={editor}
        initialOption={askInitialOption}
      />

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />

      <AskBar />
    </div>
  );
}
