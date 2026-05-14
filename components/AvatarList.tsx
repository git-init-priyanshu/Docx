import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@prisma/client";
import getInitials from "@/helpers/getInitials";

type AvatarListPropType = {
  users: {
    user: Pick<User, "name" | "picture">;
  }[];
};

export default function AvatarList({ users }: AvatarListPropType) {
  return (
    <div className="flex flex-row-reverse justify-end -space-x-2 space-x-reverse">
      {users.map((e, index) => (
        <div
          key={index}
          className="relative flex justify-center items-center size-5 rounded-full text-[8px] font-bold ring-2 ring-[var(--lp-card)]"
          style={{ background: "var(--lp-accent)", color: "white" }}
        >
          {e.user.picture ? (
            <Avatar className="size-5 absolute">
              <AvatarImage src={e.user.picture} />
            </Avatar>
          ) : (
            getInitials(e.user.name ?? "?")
          )}
        </div>
      ))}
    </div>
  );
}
