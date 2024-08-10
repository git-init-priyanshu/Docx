"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  CloudUpload,
  LogOut,
  PlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreateNewDocument, LogoutAction } from "../actions"
import useClientSession from "@/lib/customHooks/useClientSession"
import LoaderButton from "@/components/LoaderButton"

export default function HeaderButtons() {
  const router = useRouter();

  const session = useClientSession();

  const [isLoading, setIsLoading] = useState(false);

  const createDocument = async () => {
    setIsLoading(true);

    if (!session?.id) return;
    const response = await CreateNewDocument(session.id);
    if (response.success) {
      setIsLoading(false);
      toast.success("Successfully created new document")
      router.push(`/writer/${response.data?.id}`)
    } else {
      setIsLoading(false);
      toast.error(response.error)
    }
  }

  const logout = async () => {
    const response = await LogoutAction();
    console.log(response);
    if (response.success) {
      toast.success("Successfully logged out")
      router.push('/api/auth/signin')
    } else {
      toast.error(response.error)
    }
  }
  return (
    <div className="flex gap-4">
      <div className="flex md:gap-4">
        <Button
          variant="outline"
          className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-l-full md:rounded-full"
        >
          <CloudUpload size={15} />
          <p className="hidden md:block">Upload</p>
        </Button>
        <LoaderButton
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-r-full md:rounded-full"
          onClickFunc={createDocument}
          isLoading={isLoading}
          icon={<PlusIcon size={20} />}
        >
          <p className="hidden md:block">Create New</p>
        </LoaderButton>
      </div>
      <Button
        variant="outline"
        className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-full"
        onClick={logout}
      >
        <LogOut size={15} />
      </Button>
    </div>
  )
}
