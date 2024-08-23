import Image from "next/image"

import { SessionReturnType } from "@/lib/customHooks/ReturnType"
import getInitials from "@/helpers/getInitials"
import logo from "@/public/output-onlinepngtools.svg"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchBar from "./components/SearchBar"
import HeaderButtons from "./components/HeaderButtons"

type HeaderPropType = Pick<SessionReturnType, 'name' | 'image'>;
export default function Header({ image, name }: HeaderPropType) {
  return (
    <div className="flex border-b bg-white justify-between items-center py-2 px-4">
      <div className="flex gap-2 items-center">
        <Image src={logo} width={45} alt="logo" />
        {/* <p className="text-2xl">Docx</p> */}
      </div>
      <SearchBar />
      <HeaderButtons />
      {process.env.NODE_ENV === "production"
        ? <></>
        : <Avatar className="size-8">
          {image
            ? <AvatarImage src={image} />
            : <AvatarFallback>{getInitials(name ?? "")}</AvatarFallback>
          }
        </Avatar>
      }
    </div>
  )
}
