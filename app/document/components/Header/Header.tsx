import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google";
import * as motion from "framer-motion/client";

import { SessionReturnType } from "@/lib/customHooks/ReturnType";
import logo from "@/public/logo.svg";

import SearchBar from "./components/SearchBar";
import HeaderButtons from "./components/HeaderButtons";
import ProfileBtn from "./components/ProfileBtn";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"],
});

type HeaderPropType = Pick<SessionReturnType, "name" | "image">;
export default function Header({ image, name }: HeaderPropType) {
  return (
    <>
      <motion.header
        className="hidden h-16 md:flex border-b bg-white justify-between items-center py-2 px-2 md:px-4 sticky top-0 z-50"
        initial={{
          y: -50,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ ease: "easeInOut" }}
      >
        <div className="flex gap-2 items-end justify-center ">
          <Image src={logo} width={45} alt="logo" />
          <div className="overflow-hidden">
            <motion.h1
              initial={{
                x: -100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 100,
              }}
              transition={{
                delay: 0.5,
                duration: 0.4,
                ease: "easeInOut",
              }}
              className={`${roboto.className} hidden sm:block text-lg text-neutral-600 `}
            >
              DocX
            </motion.h1>
          </div>
        </div>
        <SearchBar />
        <div className="flex gap-4">
          <HeaderButtons />
          <ProfileBtn name={name} image={image} />
        </div>
      </motion.header>

      <div className="w-full p-4 flex gap-4 items-center md:hidden">
        <div className="border rounded-full bg-white p-[8px]">
          <Image src={logo} width={35} alt="logo" />
        </div>
        <SearchBar />
        <HeaderButtons />
        <ProfileBtn name={name} image={image} />
      </div>
    </>
  );
}
