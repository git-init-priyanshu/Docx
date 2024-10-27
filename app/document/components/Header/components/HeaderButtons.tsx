"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CloudUpload, PlusIcon } from "lucide-react";

import { CreateNewDocument } from "../actions";
import { Button } from "@/components/ui/button";
import LoaderButton from "@/components/LoaderButton";

export default function HeaderButtons() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const createDocument = async () => {
    setIsLoading(true);

    const response = await CreateNewDocument();
    if (response.success) {
      setIsLoading(false);
      toast.success("Successfully created new document");
      router.push(`/writer/${response.data?.id}`);
    } else {
      setIsLoading(false);
      toast.error(response.error);
    }
  };

  return (
    <div className="fixed z-10 bottom-4 right-4 md:static flex gap-4">
      {process.env.NODE_ENV === "development" ? (
        <Button
          variant="outline"
          className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-lg md:rounded-full"
        >
          <CloudUpload size={15} />
          <p className="hidden md:block">Upload</p>
        </Button>
      ) : (
        <></>
      )}
      <LoaderButton
        className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg md:rounded-full"
        onClickFunc={createDocument}
        isLoading={isLoading}
        icon={<PlusIcon size={20} />}
      >
        <p className="hidden md:block">Create New</p>
      </LoaderButton>
    </div>
  );
}
