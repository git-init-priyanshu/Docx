import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Copy,
  EllipsisVertical,
  FilePenLine,
  Share2,
  Trash2,
  Type,
  X,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  createGuestDocument,
  deleteGuestDocument,
  updateGuestDocument,
} from "@/lib/guestServices";
import LoaderButton from "@/components/LoaderButton";
import useClientSession from "@/lib/customHooks/useClientSession";
import { invalidateDocs } from "@/lib/hooks/useDocs";

import { DeleteDocument, RenameDocument } from "../actions";
import { CreateNewDocument } from "../../Header/actions";

type CardOptionsPropType = {
  docId: string;
  data?: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function CardOptions({
  docId,
  data,
  inputRef,
}: CardOptionsPropType) {
  const router = useRouter();

  const session = useClientSession();

  const docOptions = [
    {
      icon: Type,
      color: "#60b7c3",
      title: "Rename",
      onClick: () => renameDocument(),
    },
    {
      icon: FilePenLine,
      color: "#48acf9",
      title: "Edit",
      onClick: () => editDocument(),
    },
    {
      icon: Copy,
      color: "#b78cf9",
      title: "Duplicate",
      onClick: () => duplicateDocument(),
    },
    {
      icon: Share2,
      color: "#48f983",
      title: "Share",
      onClick: () => shareDocument(),
    },
    {
      icon: Trash2,
      color: "#f94848",
      title: "Delete",
      onClick: () => deleteDocument(),
    },
  ];

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const renameDocument = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsOptionsOpen(false);
  };

  const editDocument = () => {
    router.push(`/writer/${docId}`);
  };

  const shareDocument = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/writer/${docId}`)
      .then(() => {
        toast.success("Share link copied to clipboard");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Couldn't copy link");
      })
      .finally(() => {
        setIsOptionsOpen(false);
      });
  };

  const duplicateDocument = async () => {
    setIsOptionsOpen(false);
    const currentName = inputRef.current?.value ?? "Untitled document";

    try {
      if (session?.id) {
        const response = await CreateNewDocument(data ?? "");
        if (!response.success || !response.data) {
          toast.error(response.error);
          return;
        }
        await RenameDocument(response.data.id, `${currentName} (copy)`);
        await invalidateDocs(session.id);
      } else {
        const newDoc = createGuestDocument(data ?? "");
        updateGuestDocument(newDoc.id, "name", `${currentName} (copy)`);
        await invalidateDocs();
      }
      toast.success("Document duplicated");
    } catch (e) {
      console.log(e);
      toast.error("Couldn't duplicate document");
    }
  };

  const deleteDocument = async () => {
    setIsOptionsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDocument = async () => {
    setIsDeleting(true);

    if (session?.id) {
      const response = await DeleteDocument(docId);
      if (response.success) {
        toast.success(response.data);
        await invalidateDocs(session.id);
      } else {
        toast.error(response.error);
      }
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    } else {
      deleteGuestDocument(docId);
      await invalidateDocs();
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  return (
    <>
      <Popover open={isOptionsOpen}>
        <PopoverTrigger onClick={() => setIsOptionsOpen(true)}>
          <EllipsisVertical size={20} className="hover:text-blue-500" />
        </PopoverTrigger>
        <PopoverContent
          onPointerDownOutside={() => setIsOptionsOpen(false)}
          className="flex flex-col p-0 py-1 text-left w-min"
          style={{
            background: "var(--lp-card)",
            borderColor: "var(--lp-border)",
          }}
        >
          {docOptions.map((item, index) =>
            (session?.id || item.title !== "Share") && (
              <Button
                key={index}
                id={item.title}
                variant="ghost"
                className="gap-2 justify-start item-center text-xs hover:bg-[var(--lp-paper-2)]"
                style={{ color: "var(--lp-ink)" }}
                onClick={item.onClick}
              >
                <item.icon size={15} color={item.color} strokeWidth={1.5} />
                <p>{item.title}</p>
              </Button>
            )
          )}
        </PopoverContent>
      </Popover>

      <Dialog open={isDeleteModalOpen}>
        <DialogContent className="bg-[var(--lp-card)] border-[var(--lp-border)] text-[var(--lp-ink)]">
          <DialogHeader className="relative">
            <DialogTitle className="text-[var(--lp-ink)]">
              Delete Document?
            </DialogTitle>
            <DialogDescription className="text-[var(--lp-muted)]">
              Are you sure you want to delete this document?
            </DialogDescription>
            <Button
              variant="ghost"
              className="z-10 absolute -right-2 -top-6 px-2 text-[var(--lp-muted)]"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X size={15} />
            </Button>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="bg-[var(--lp-card)] border-[var(--lp-border)] text-[var(--lp-ink)]"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <LoaderButton
              variant="outline"
              onClickFunc={confirmDeleteDocument}
              isLoading={isDeleting}
              className="bg-[color-mix(in_oklab,var(--lp-rose)_15%,var(--lp-card))] border-[color-mix(in_oklab,var(--lp-rose)_40%,var(--lp-border))] text-[var(--lp-rose)]"
            >
              Confirm
            </LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
