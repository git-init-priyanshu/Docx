"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Upload
} from "lucide-react"
import logo from "@/public/doc.svg"
import { CreateNewDocument } from "./actions"
import { toast } from "sonner"
import { useState } from "react"

export default function Header() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const createDocument = async () => {
    setIsLoading(true);
    const email = "bartwalpriyanshu@gmail.com"
    const response = await CreateNewDocument(email)
    if (response.success) {
      setIsLoading(false);
      toast.success("Successfully created new document")
      router.push(`/writer/${response.data?.id}`)
    } else {
      setIsLoading(false);
      toast.error(response.error)
    }
  }

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
          onClick={createDocument}
          disabled={isLoading}
        >
          {isLoading ? <svg
            className="animate-spin lucide lucide-loader-circle"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg> : <Plus size={20} />}
          Create New
        </Button>
      </div>
    </div>
  )
}
