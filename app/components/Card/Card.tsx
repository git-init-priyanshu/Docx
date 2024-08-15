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
import { RenameDocument } from "./actions"
import useClientSession from "@/lib/customHooks/useClientSession"
import { CircleCheck } from "lucide-react"

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
export default function DocCard({
  docId,
  thumbnail,
  title,
  updatedAt,
  users
}: DocCardPropType) {
  const router = useRouter();

  const session = useClientSession();
  localStorage.setItem('name', session.name as string);

  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(title)

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
        <div className="relative">
          <Input
            ref={inputRef}
            value={name}
            className="w-full text-md border-none focus-visible:bg-slate-50"
            onChange={e => setName(e.target.value)}
          />
          <CircleCheck
            onClick={async () => {
              if (!inputRef.current || !session?.id) return;
              await RenameDocument(docId, session.id, inputRef.current.value);
            }}
            className={`${title != name ? "" : "hidden"} size-4 text-slate-500 hover:cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2`}>
          </CircleCheck>
        </div>
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
