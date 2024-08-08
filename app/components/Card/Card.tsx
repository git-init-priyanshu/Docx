'use client'

import { useCallback, useMemo, useRef, useState } from "react"
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
import { debounce } from "lodash"
import { RenameDocument } from "./actions"
import useClientSession from "@/lib/customHooks/useClientSession"

type DocCardPropType = {
  docId: string;
  thumbnail: string | null;
  title: string;
  updatedAt: Date
  users: {
    user:
    {
      name: string,
      picture: string | null
    }
  }[]
}
export default function DocCard({ docId, thumbnail, title, updatedAt, users }: DocCardPropType) {
  const router = useRouter();

  const session = useClientSession();

  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(title)

  const saveName = useCallback(async () => {
    if (!inputRef.current || !session?.id) return;
    await RenameDocument(docId, session.id, inputRef.current.value);
  }, [])

  const debounceSaveName = useMemo(() => debounce(saveName, 2000), [saveName])

  const getInitials = (name: string) => {
    let initials = name.split(" ");

    if (initials.length > 2) return initials[0][0] + initials[1][0];
    return initials[0][0];
  }

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
          onChange={e => {
            setName(e.target.value)
            debounceSaveName();
          }}
        />
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2 items-center">
            {users.map((e, index) => {
              return (
                <Avatar key={index} className="size-8">
                  {
                    e.user.picture
                      ? <AvatarImage src={e.user.picture} />
                      : <AvatarFallback>{getInitials(e.user.name)}</AvatarFallback>
                  }
                </Avatar>
              )
            })}
            <p className="text-neutral-600 cursor-default">
              {prettifyDate(String(updatedAt), {
                year: "numeric",
                month: "short",
                day: "2-digit"
              })}
            </p>
          </div>
          <CardOptions docId={docId} inputRef={inputRef} />
        </div>
      </CardFooter>
    </Card>
  )
}
