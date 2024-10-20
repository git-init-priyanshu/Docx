"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoaderButton from "@/components/LoaderButton";

import { SigninAction } from "../../actions";
import { signinSchema } from "../../zodSchema";

export default function CredentialsForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<z.infer<typeof signinSchema>>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitForm = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const parsedData = signinSchema.parse({
      email: data.email,
      password: data.password,
    });
    const response = await SigninAction(parsedData);
    if (response.success) {
      toast.success("login completed");
      router.push("/document");
      setIsSubmitting(false);
    } else {
      toast.error(response.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4 text-left" onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="johndoe@email.com"
          {...register("email", { required: true })}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <button
            className="ml-auto inline-block text-sm text-blue-500 hover:underline"
            onClick={() => router.push("/forget-password")}
          >
            Forgot your password?
          </button>
        </div>
        <div>
          <Input
            type={isPasswordVisible ? "text" : "password"}
            className="relative"
            {...register("password", { required: true })}
          />
          {!isPasswordVisible ? (
            <Eye
              size={20}
              onClick={() => setIsPasswordVisible(true)}
              className="absolute transform -translate-y-[1.7rem] translate-x-80 cursor-pointer text-neutral-500 hover:text-black"
            />
          ) : (
            <EyeOff
              size={20}
              onClick={() => setIsPasswordVisible(false)}
              className="absolute transform -translate-y-[1.7rem] translate-x-80 cursor-pointer text-neutral-500 hover:text-black"
            />
          )}
        </div>
      </div>
      <LoaderButton
        className="w-full bg-blue-500 hover:bg-blue-600"
        isLoading={isSubmitting}
        type="submit"
      >
        Sign in
      </LoaderButton>
    </form>
  );
}
