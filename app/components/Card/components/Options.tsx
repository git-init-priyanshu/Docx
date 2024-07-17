import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  EllipsisVertical,
  FilePenLine,
  Share2,
  Trash2,
  Type
} from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { DeleteDocument } from "../actions"

type CardOptionsPropType = {
  docId: string,
  inputRef: React.RefObject<HTMLInputElement>,
  refetch: () => void
}

export default function CardOptions({docId, inputRef, refetch }: CardOptionsPropType) {
  const router = useRouter();

  const docOptions = [
    { icon: Type, color: "#60b7c3", title: "Rename", onClick: () => renameDocument() },
    { icon: FilePenLine, color: "#48acf9", title: "Edit", onClick: () => editDocument() },
    { icon: Share2, color: "#48f983", title: "Share", onClick: () => console.log("edit") },
    { icon: Trash2, color: "#f94848", title: "Delete", onClick: () => deleteDocument() },
  ]

  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const renameDocument = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsOptionsOpen(false);
  }

  const editDocument = () => {
    router.push(`/writer/${docId}`)
  }

  const deleteDocument = async () => {
    setIsOptionsOpen(false);
    setIsOpen(true);
  }
  return (
    <>
      <Popover open={isOptionsOpen}>
        <PopoverTrigger onClick={() => setIsOptionsOpen(true)}>
          <EllipsisVertical size={20} className="hover:text-blue-500" />
        </PopoverTrigger>
        <PopoverContent
          onPointerDownOutside={() => setIsOptionsOpen(false)}
          className="flex flex-col p-0 py-2 text-left w-min"
        >
          {docOptions.map((item) => {
            return (
              <Button variant="ghost" className="gap-2 justify-start" onClick={item.onClick}>
                <item.icon size={20} color={item.color} strokeWidth={1.5} />
                <p className="text-neutral-600">{item.title}</p>
              </Button>
            )
          })}
        </PopoverContent>
      </Popover>

      <Dialog open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => {
              const response = await DeleteDocument("bartwalpriyanshu@gmail.com", docId)
              if (response.success) {
                refetch();
                toast.success(response.data)
              } else {
                toast.error(response.error)
              }
            }}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
