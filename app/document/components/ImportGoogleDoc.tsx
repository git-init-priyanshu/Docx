"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import useClientSession from "@/lib/customHooks/useClientSession";
import {
  isPickerConfigured,
  pickGoogleDocument,
  preloadGooglePicker,
} from "@/lib/googleDocs/picker";
import { fetchGoogleDocument } from "@/lib/googleDocs/fetchDocument";
import { toTiptap, type DroppedContent } from "@/lib/googleDocs/toTiptap";
import { ImportDocument } from "../import/actions";
import { IndexDocument } from "@/app/writer/[id]/rag/actions";

const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

/**
 * The editor has no node for images, so they are lost on import. Saying so
 * beats letting someone discover it in a document they trusted.
 */
const describeDropped = ({ images }: DroppedContent) => {
  if (images === 0) return null;
  return `${plural(images, "image")} could not be imported`;
};

export default function ImportGoogleDoc() {
  const router = useRouter();
  const session = useClientSession();
  const [isImporting, setIsImporting] = useState(false);

  if (!isPickerConfigured()) return null;

  const handleClick = async () => {
    if (isImporting) return;

    if (!session?.id) {
      toast.error("Sign in to import from Google Docs");
      return;
    }

    setIsImporting(true);
    try {
      const picked = await pickGoogleDocument();
      if (!picked) return;

      const source = await fetchGoogleDocument(picked.file.id, picked.token);
      const { doc, dropped } = toTiptap(source);

      const response = await ImportDocument(
        picked.file.name,
        JSON.stringify(doc),
      );
      if (!response.success || !response.data) {
        toast.error(response.error);
        return;
      }

      // Not awaited, matching the editor: embedding takes seconds and the
      // document is already saved. A dropped call is retried by the next
      // snapshot, since indexedHash still disagrees with the content.
      IndexDocument(response.data.id).catch(() => {});

      const lost = describeDropped(dropped);
      toast.success(
        lost ? `Imported — ${lost}` : `Imported “${picked.file.name}”`,
      );
      router.push(`/writer/${response.data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      onPointerEnter={preloadGooglePicker}
      onFocus={preloadGooglePicker}
      disabled={isImporting}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] text-[12.5px] font-medium text-[var(--lp-ink)] transition-colors hover:border-[var(--lp-accent)] disabled:opacity-50"
    >
      {isImporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path fill="#A1C2FA" d="M14 2v6h6z" />
        </svg>
      )}
      {isImporting ? "Importing…" : "Import from Google Docs"}
    </button>
  );
}
