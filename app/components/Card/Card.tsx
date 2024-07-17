'use client'

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

import prettifyDate from '@/helpers/prettifyDates'
import CardOptions from "./components/Options"

type DocCardPropType = {
  docId: string;
  thumbnail: string | null;
  title: string;
  createdAt: Date
  refetch: () => void
}
export default function DocCard({ docId, thumbnail, title, createdAt, refetch }: DocCardPropType) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(title)
  return (
    <Card className="hover:shadow-lg" >
      <CardContent
        className={`size-52 w-full overflow-hidden cursor-pointer bg-cover`}
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={() => router.push(`/writer/${docId}`)}
      >
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t p-4">
        <Input
          ref={inputRef}
          value={name}
          className="w-full text-md border-none focus:outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-neutral-600 cursor-default">{prettifyDate(String(createdAt))}</p>
          </div>
          <CardOptions docId={docId} inputRef={inputRef} refetch={refetch} />
        </div>
      </CardFooter>
    </Card>
  )
}
