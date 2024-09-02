import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google"

import { SessionReturnType } from "@/lib/customHooks/ReturnType";
import getInitials from "@/helpers/getInitials";
import logo from "@/public/logo.svg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "./components/SearchBar";
import HeaderButtons from "./components/HeaderButtons";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"]
})

type HeaderPropType = Pick<SessionReturnType, "name" | "image">;
export default function Header({ image, name }: HeaderPropType) {
  return (
    <div className="flex border-b bg-white justify-between items-center py-2 px-4">
      <div className="flex gap-2 items-end justify-center">
        <Image src={logo} width={45} alt="logo" />
        <p className={`${roboto.className} text-lg`}>DocX</p>
        {/* <Image src={logo} width={45} alt="logo" /> */}
      </div>
      <SearchBar />
      <HeaderButtons />
      {process.env.NODE_ENV === "production" ? (
        <></>
      ) : (
        <Avatar className="size-8">
          {image ? (
            <AvatarImage src={image} />
          ) : (
            <AvatarFallback>{getInitials(name ?? "")}</AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
}
