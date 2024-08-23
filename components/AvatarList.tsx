import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import type { User } from "@prisma/client"
import getInitials from "@/helpers/getInitials"

type AvatarListPropType = {
  users: {
    user: Pick<User, 'name' | 'picture'>
  }[]
}

export default function AvatarList({ users }: AvatarListPropType) {
  return (
    <div className="flex flex-row-reverse justify-end -space-x-3 space-x-reverse *:ring *:ring-white">
      {
        users.map((e, index) => {
          return (
            <Avatar key={index} className="size-8">
              {
                e.user.picture
                  ? <AvatarImage src={e.user.picture} />
                  : <AvatarFallback>{getInitials(e.user.name)}</AvatarFallback>
              }
            </Avatar>
          )
        })
      }
    </div>
  )
}
