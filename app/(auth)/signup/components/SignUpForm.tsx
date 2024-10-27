"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoaderButton from "@/components/LoaderButton";

import { SignupAction } from "../../actions";
import { signupSchema } from "../../zodSchema";

export default function CredentialsForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<z.infer<typeof signupSchema>>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegexError, setIsRegexError] = useState(false);

  const submitForm = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const parsedData = signupSchema.safeParse({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (!parsedData.success) {
        if (parsedData.error.issues[0].code === "invalid_string")
          setIsRegexError(true);
        setIsSubmitting(false);
      }

      if (!parsedData.data) return;

      const response = await SignupAction(parsedData.data);
      if (response.success) {
        toast.success("User registerd successfully. Please verify your email.");
        router.push(`/otp/${data.email}`);
        setIsSubmitting(false);
      } else {
        console.log(response.error);
        console.log("here");
        toast.error(response.error);
        setIsSubmitting(false);
      }
    } catch (e: ZodError | any) {
      console.log(e);
      setIsSubmitting(false);
    }
  };
  return (
    <form className="grid gap-4 text-left" onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          placeholder="JohnDoe"
          {...register("username", { required: true })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          placeholder="John Doe"
          {...register("name", { required: true })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: true })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
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
          {isRegexError ? (
            <p className="text-red-400">
              Password must include at least one uppercase, one lowercase, one
              digit, one special character, and be at least 8 characters long.
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
      <LoaderButton
        className="w-full bg-blue-500 hover:bg-blue-600"
        isLoading={isSubmitting}
      >
        Sign up
      </LoaderButton>
    </form>
  );
}
