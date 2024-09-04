"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { User } from "@prisma/client";

import { RenameDocument } from "./actions";
import AvatarList from "@/components/AvatarList";
import CardOptions from "./components/Options";
import prettifyDate from "@/helpers/prettifyDates";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";

type DocCardPropType = {
  docId: string;
  thumbnail: string | null;
  title: string;
  updatedAt: Date;
  users: {
    user: Pick<User, "name" | "picture">;
  }[];
};
export default function DocCard({
  docId,
  thumbnail,
  title,
  updatedAt,
  users,
}: DocCardPropType) {
  const router = useRouter();

  const debounce = useDebounce(async () => {
    if (!inputRef.current || !session?.id) return;
    await RenameDocument(docId, inputRef.current.value);
  }, 1000)

  const session = useClientSession();
  localStorage.setItem("name", session.name as string);

  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(title);

  return (
    <Card className="hover:shadow-lg">
      <CardContent
        className={`size-52 w-full overflow-hidden cursor-pointer bg-cover`}
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={() => router.push(`/writer/${docId}`)}
      ></CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t p-4">
        <div className="relative">
          <Input
            ref={inputRef}
            value={name}
            className="w-full text-md border-none focus-visible:bg-slate-50"
            onChange={(e) => {
              setName(e.target.value);
              debounce(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2 items-center">
            <AvatarList users={users} />
            <p className="text-neutral-600 cursor-default">
              {prettifyDate(String(updatedAt), {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
          <CardOptions docId={docId} inputRef={inputRef} />
        </div>
      </CardFooter>
    </Card>
  );
}
