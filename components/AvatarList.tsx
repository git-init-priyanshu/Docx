import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@prisma/client";
import getInitials from "@/helpers/getInitials";

type AvatarListPropType = {
  users: {
    user: Pick<User, "name" | "picture">;
  }[];
};

const MAX_VISIBLE = 3;

export default function AvatarList({ users }: AvatarListPropType) {
  const visible = users.slice(0, MAX_VISIBLE);
  const overflow = users.length - visible.length;

  return (
    <div className="flex flex-row-reverse justify-end -space-x-2 space-x-reverse shrink-0">
      {overflow > 0 && (
        <div
          className="relative flex justify-center items-center size-5 rounded-full text-[8px] font-bold ring-2 ring-[var(--lp-card)] shrink-0 bg-[var(--lp-paper-2)] text-[var(--lp-muted)]"
        >
          +{overflow}
        </div>
      )}
      {visible.map((e, index) => (
        <div
          key={e.user.name ?? index}
          className="relative flex justify-center items-center size-5 rounded-full text-[8px] font-bold ring-2 ring-[var(--lp-card)] shrink-0"
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
