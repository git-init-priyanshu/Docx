"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import LoaderButton from "@/components/LoaderButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../../actions";
import { passwordValidation } from "../../zodSchema";

export default function ResetPassword() {
  const params = useParams();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegexError, setIsRegexError] = useState(false);

  const changePassword = async () => {
    setIsSubmitting(true);
    try {
      if (passwordValidation.test(newPassword)) {
        if (newPassword !== confirmNewPassword) {
          setIsSubmitting(false);
          return toast.error("New password and confirm password do not match.");
        }

        const response = await resetPassword(params.id, newPassword);
        if (response.success) {
          toast.success(response.data);
          router.push(`/signin`);
          setIsSubmitting(false);
        } else {
          console.log(response.error);
          toast.error(response.error);
          setIsSubmitting(false);
        }
      } else {
        setIsRegexError(true);
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
          <span className="text-black">Change your&nbsp;</span>
          <span className="text-blue-500">Password</span>
        </h1>
      </div>
      <form
        className="flex flex-col gap-2 mt-4 text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          changePassword();
        }}
      >
        <Label htmlFor="new-password">New password</Label>
        <Input
          value={newPassword}
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {isRegexError ? (
          <p className="text-red-400">
            Password must include at least one uppercase, one lowercase, one
            digit, one special character, and be at least 8 characters long.
          </p>
        ) : (
          <></>
        )}

        <Label htmlFor="new-password">Confirm new password</Label>
        <Input
          value={confirmNewPassword}
          type="password"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <LoaderButton
          className="w-full bg-blue-500 hover:bg-blue-600"
          isLoading={isSubmitting}
          type="submit"
        >
          Change my password
        </LoaderButton>
      </form>
    </>
  );
}
