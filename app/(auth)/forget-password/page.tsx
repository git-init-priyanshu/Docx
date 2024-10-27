"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import LoaderButton from "@/components/LoaderButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPasswordMail } from "../actions";

export default function ForgetPassoword() {
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMail = async () => {
    setIsSubmitting(true);
    try {
      const response = await sendResetPasswordMail(inputEmail);
      if (response.success) {
        toast.success(response.data);
        router.push(`/signin`);
        setIsSubmitting(false);
      } else {
        console.log(response.error);
        toast.error(response.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.log(e);
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 text-center items-center">
        <KeyRound size={48} color="#3b82f6" />
        <h1 className="text-3xl font-bold">
          <span className="text-black">Forgot your&nbsp;</span>
          <span className="text-blue-500">Password ?</span>
        </h1>
        <p className="text-muted-foreground ">
          Enter the email address , and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="you@example.com"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <LoaderButton
          className="w-full bg-blue-500 hover:bg-blue-600"
          isLoading={isSubmitting}
          onClickFunc={sendMail}
        >
          Send email
        </LoaderButton>
      </div>
    </>
  );
}
