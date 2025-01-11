'use client'

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { CreateNewDocument } from "./Header/actions";
import { createGuestDocument } from "@/lib/guestServices";
import EmptyBox from "@/public/createdoc.png"
import useClientSession from "@/lib/customHooks/useClientSession";

export default function Onboarding() {
  const router = useRouter();

  const session = useClientSession();

  const createDocument = async () => {
    if (session?.id) {
      const response = await CreateNewDocument();
      if (response.success) {
        toast.success("Successfully created new document");
        router.push(`/writer/${response.data?.id}`);
      } else {
        toast.error(response.error);
      }
    } else {
      const document = createGuestDocument();
      toast.success("Successfully created new document");
      router.push(`/writer/${document.id}`);
    }
  };
  return (
    <div
      className="w-full flex flex-col justify-center items-center"
      style={{
        height: "calc(100vh - 4rem)"
      }}
    >
      <Image
        src={EmptyBox}
        alt="empty"
        className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] cursor-pointer"
        onClick={createDocument}
      />
    </div>
  )
}
