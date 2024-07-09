import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Upload
} from "lucide-react"
import logo from "@/public/doc.svg"

export default function Header() {
  return (
    <div className="flex border-b bg-white justify-between items-center py-2 px-4">
      <div className="flex gap-2 items-center">
        <Image src={logo} width={45} alt="logo" />
        <p className="text-2xl">Docx</p>
      </div>
      <div>
        <Input className="relative pl-8 rounded-full" placeholder="Search documents..." />
        <Search size={20} className="absolute text-slate-500 top-5 ml-2" />
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-full"
        >
          <Upload size={15} />
          Upload
        </Button>
        <Button
          className="flex gap-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full"
        >
          <Plus size={20} />
          Create New
        </Button>
      </div>
    </div>
  )
}
