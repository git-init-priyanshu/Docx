"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import Google from "@/public/google_icon.svg";
import { Button } from "@/components/ui/button";

export default function GoogleAuthButton() {
  return (
    <Button
      variant="outline"
      className="w-full flex gap-2"
      onClick={() => signIn("google", { redirect: true })}
    >
      <Image src={Google} alt="google" width={15} />
      Continue with Google
    </Button>
  );
}
