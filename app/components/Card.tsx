'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  EllipsisVertical,
  FilePenLine,
  FileText,
  Share2,
  Trash2,
  Type
} from "lucide-react"

import {
  Card,
  CardFooter,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"

type DocCardPropType = {
  docId: string;
  thumbnail: string;
  title: string;
  createdAt: string
}
export default function DocCard({ docId, thumbnail, title, createdAt }: DocCardPropType) {
  const router = useRouter();
  const inputRef = useRef();

  const docOptions = [
    { icon: Type, color: "#60b7c3", title: "Rename", onClick: () => renameDocument() },
    { icon: FilePenLine, color: "#48acf9", title: "Edit", onClick: () => console.log("edit") },
    { icon: Share2, color: "#48f983", title: "Share", onClick: () => console.log("edit") },
    { icon: Trash2, color: "#f94848", title: "Delete", onClick: () => console.log("edit") },
  ]

  const [name, setName] = useState(title)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  const renameDocument = () => {
    setIsOptionsOpen(false);
  }
  return (
    <Card className="hover:shadow-lg cursor-pointer" onClick={() => router.push(`/writer/${docId}`)}>
      <div className="size-40 mx-auto overflow-hidden">
        <Image src={thumbnail} alt="doc" className="border" />
      </div>
      <CardFooter className="flex flex-col items-start gap-4 border-t p-4">
        <div className="flex items-center gap-1">
          <FileText size={25} className="text-neutral-500" />
          <Input
            // ref={inputRef}
            className="w-full text-md border-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-neutral-600">{createdAt}</p>
          </div>
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
        </div>
      </CardFooter>
    </Card>
  )
}
