import logo from "@/public/doc.svg"
import Image from "next/image"

export default function Header() {
  return (
    <div className="flex justify-between items-center py-2 px-4">
      <div className="flex gap-2 items-center">
        <Image src={logo} width={45} alt="logo" />
        <p className="text-2xl">Docx</p>
      </div>
      <div>Search</div>
      <div>Buttons</div>
    </div>
  )
}
