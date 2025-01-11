"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { motion } from "framer-motion";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SessionReturnType } from "@/lib/customHooks/ReturnType";
import getInitials from "@/helpers/getInitials";

import { LogoutAction } from "../actions";
import useClientSession from "@/lib/customHooks/useClientSession";

type ProfileBtnPropType = Pick<SessionReturnType, "name" | "image">;
export default function ProfileBtn({ name, image }: ProfileBtnPropType) {
  const router = useRouter();

  const session = useClientSession();

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
    !session?.id
      ?
      <Button
        variant="outline"
        className="flex gap-2 text-blue-500 hover:text-blue-500 hover:border-blue-200 rounded-lg md:rounded-full"
        onClick={()=>router.push("/signup")}
      >
        <LogIn size={15} />
        <p className="hidden md:block">Signup</p>
      </Button>

      : <Popover>
        <PopoverTrigger>
          <div className="relative flex justify-center items-center bg-blue-50 size-8 rounded-full ring-blue-100 hover:ring">
            <p>{getInitials(name ?? "X")}</p>
          </div>
          {image ? (
            <Avatar className="size-8 absolute transform -translate-y-full">
              <AvatarImage src={image} />
            </Avatar>
          ) : (
            <></>
          )}
        </PopoverTrigger>
        <PopoverContent className="flex flex-col p-0 py-1 text-left w-min bg-white shadow-md">
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
          >
            <Button
              variant="ghost"
              className="gap-2 justify-start"
              onClick={logout}
            >
              <LogOut size={20} color="#48acf9" strokeWidth={1.5} />
              <p className="text-neutral-600">Logout</p>
            </Button>
          </motion.div>
        </PopoverContent>
      </Popover>
  );
}
