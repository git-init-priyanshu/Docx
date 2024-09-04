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
    <div className="flex flex-row-reverse justify-end -space-x-4 space-x-reverse *:ring *:ring-white">
      {users.map((e, index) => {
        return (
          <div key={index}>
            <div className="relative flex justify-center items-center bg-blue-50 size-8 rounded-full">
              <p>{getInitials(e.user.name ?? "X")}</p>
            </div>
            {e.user.picture ? (
              <Avatar className="size-8 absolute transform -translate-y-full">
                <AvatarImage src={e.user.picture} />
              </Avatar>
            ) : <></>}
          </div>
        )
      })}
    </div>
  );
}
