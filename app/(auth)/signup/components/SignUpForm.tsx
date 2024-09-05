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

import { SignupAction } from "../../actions";
import { signupSchema } from "../../zodSchema";

export default function CredentialsForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<z.infer<typeof signupSchema>>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitForm = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    const parsedData = signupSchema.parse({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    });

    const response = await SignupAction(parsedData);
    if (response.success) {
      toast.success("Signin completed");
      router.push("/document");
      setIsSubmitting(false);
    } else {
      console.log(response.error);
      toast.error(response.error);
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
          placeholder="m@example.com"
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
        </div>
      </div>
      <LoaderButton
        className="w-full bg-blue-500 hover:bg-blue-600"
        isLoading={isSubmitting}
        type="submit"
      >
        Sign up
      </LoaderButton>
    </form>
  );
}
