"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CloudUpload, LogOut, PlusIcon } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CreateNewDocument, LogoutAction } from "../actions";
import { Button } from "@/components/ui/button";
import { SessionReturnType } from "@/lib/customHooks/ReturnType";
import LoaderButton from "@/components/LoaderButton";
import getInitials from "@/helpers/getInitials";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

type HeaderBtnPropType = Pick<SessionReturnType, "name" | "image">;
export default function HeaderButtons({ image, name }: HeaderBtnPropType) {
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

  const logout = async () => {
    const response = await LogoutAction();
    if (response.success) {
      toast.success("Successfully logged out");
      router.push("/api/auth/signin");
    } else {
      toast.error(response.error);
    }
  };
  return (
    <div className="flex gap-4">
      <div className="flex md:gap-4">
        {process.env.NODE_ENV === "development" ?
          <Button
            variant="outline"
            className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-l-full md:rounded-full"
          >
            <CloudUpload size={15} />
            <p className="hidden md:block">Upload</p>
          </Button>
          : <></>
        }
        <LoaderButton
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-r-full md:rounded-full"
          onClickFunc={createDocument}
          isLoading={isLoading}
          icon={<PlusIcon size={20} />}
        >
          <p className="hidden md:block">Create New</p>
        </LoaderButton>
      </div>
      <Popover>
        <PopoverTrigger>
          <div className="relative flex justify-center items-center bg-blue-50 size-8 rounded-full ring-blue-100 hover:ring">
            <p>{getInitials(name ?? "X")}</p>
          </div>
          {image ? (
            <Avatar className="size-8 absolute transform -translate-y-full">
              <AvatarImage src={image} />
            </Avatar>
          ) : (<></>)}
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col p-0 py-1 text-left w-min bg-white shadow-md"
        >
          <Button
            // id={item.title}
            variant="ghost"
            className="gap-2 justify-start"
            onClick={logout}
          >
            <LogOut size={20} color="#48acf9" strokeWidth={1.5} />
            <p className="text-neutral-600">Logout</p>
          </Button>
        </PopoverContent>
      </Popover>
    </div >
  );
}
