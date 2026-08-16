"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";

import useClientSession from "@/lib/customHooks/useClientSession";
import prettifyDate from "@/helpers/prettifyDates";
import DocThumbnail from "@/components/DocThumbnail";
import {
  useVersions,
  invalidateVersions,
  type DocVersion,
} from "@/lib/hooks/useVersions";
import { restoreGuestVersion } from "@/lib/guestServices";
import { RestoreDocVersion } from "../versions/actions";

type HistoryTabProps = {
  editor: Editor | null;
};

export default function HistoryTab({ editor }: HistoryTabProps) {
  const params = useParams();
  const docId = params.id as string;
  const session = useClientSession();
  const userId = session === null ? null : session?.id;

  const { versions, isLoading } = useVersions(docId, userId);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleRestore = async (version: DocVersion) => {
    if (!editor) return;
    if (
      !window.confirm("Restore this version? Current content will be replaced.")
    )
      return;

    setRestoringId(version.id);
    try {
      let data: string | undefined;
      if (session?.id) {
        const res = await RestoreDocVersion(docId, version.id);
        if (!res.success || !("data" in res)) {
          toast.error("error" in res ? res.error : "Could not restore version");
          return;
        }
        data = res.data;
      } else {
        data = restoreGuestVersion(docId, version.id);
      }
      if (!data) {
        toast.error("Could not restore version");
        return;
      }
      editor.commands.setContent(JSON.parse(data));
      invalidateVersions(docId);
      toast.success("Version restored");
    } catch {
      toast.error("Could not restore version");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3 overflow-y-auto">
      <div className="text-[12.5px] font-medium text-[var(--lp-ink)]">
        Version history
      </div>

      {isLoading ? (
        <p className="text-[12.5px] text-[var(--lp-muted)]">Loading history…</p>
      ) : !versions || versions.length === 0 ? (
        <p className="text-[12.5px] text-[var(--lp-muted)]">
          No saved versions yet. Snapshots are captured as you write.
        </p>
      ) : (
        versions.map((version) => (
          <div
            key={version.id}
            className="rounded-lg border overflow-hidden border-[var(--lp-border)] bg-[var(--lp-card)]"
          >
            <DocThumbnail data={version.data} className="h-[120px] w-full" />
            <div className="flex items-center justify-between gap-2 p-2.5 border-t border-[var(--lp-border)]">
              <span className="text-[11.5px] text-[var(--lp-muted)]">
                {prettifyDate(String(version.createdAt), {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <button
                onClick={() => handleRestore(version)}
                disabled={restoringId !== null}
                className="text-[11.5px] px-2.5 py-1 rounded-md border transition-colors hover:bg-[var(--lp-paper-2)] disabled:opacity-50 disabled:cursor-not-allowed border-[var(--lp-border)] text-[var(--lp-ink)]"
              >
                {restoringId === version.id ? "Restoring…" : "Restore"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
