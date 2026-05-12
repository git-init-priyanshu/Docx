"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useClientSession from "@/lib/customHooks/useClientSession";
import { CreateNewDocument } from "./Header/actions";
import { createGuestDocument } from "@/lib/guestServices";

type Props = {
  content?: string;
  children: ReactNode;
  className?: string;
};

export default function NewDocButton({ content, children, className }: Props) {
  const router = useRouter();
  const session = useClientSession();

  const handleClick = async () => {
    if (session?.id) {
      const response = await CreateNewDocument(content);
      if (response.success) {
        toast.success("Successfully created new document");
        router.push(`/writer/${response.data?.id}`);
      } else {
        toast.error(response.error);
      }
    } else {
      const doc = createGuestDocument(content);
      toast.success("Successfully created new document");
      router.push(`/writer/${doc.id}`);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
