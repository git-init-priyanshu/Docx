import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google"

import { SessionReturnType } from "@/lib/customHooks/ReturnType";
import logo from "@/public/logo.svg";

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
    <div className="flex border-b bg-white justify-between items-center py-2 px-4 sticky top-0 z-50">
      <div className="flex gap-2 items-end justify-center">
        <Image src={logo} width={45} alt="logo" />
        <p className={`${roboto.className} text-lg text-neutral-600`}>DocX</p>
        {/* <Image src={logo} width={45} alt="logo" /> */}
      </div>
      <SearchBar />
      <HeaderButtons image={image} name={name} />
    </div>
  );
}
