import Image from "next/image"
import logo from "@/public/output-onlinepngtools.svg"
import SearchBar from "./components/SearchBar"
import HeaderButtons from "./components/HeaderButtons"

export default function Header() {

  return (
    <div className="flex border-b bg-white justify-between items-center py-2 px-4">
      <div className="flex gap-2 items-center">
        <Image src={logo} width={45} alt="logo" />
        {/* <p className="text-2xl">Docx</p> */}
      </div>
      <SearchBar />
      <HeaderButtons />
    </div>
  )
}
