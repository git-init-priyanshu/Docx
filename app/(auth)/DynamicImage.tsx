"use client";

import { usePathname } from "next/navigation";
import Image, { type StaticImageData } from "next/image";

import SignIn from "@/public/signin.webp";
import SignUp from "@/public/Signup.webp";
import ResetPassword from "@/public/Reset password.webp";
import ForgotPassword from "@/public/Forgot password.webp";
import VerifyOtp from "@/public/Verify otp.webp";

const IMAGE_MAP: Record<string, StaticImageData> = {
  signin: SignIn,
  signup: SignUp,
  "reset-password": ResetPassword,
  "forget-password": ForgotPassword,
  otp: VerifyOtp,
};

export default function DynamicImage() {
  const segment = usePathname().split("/")[1];
  const image = IMAGE_MAP[segment];
  if (!image) return null;
  return (
    <Image
      src={image}
      alt="Image"
      className="h-full w-full dark:brightness-[0.2] dark:grayscale bg-white"
    />
  );
}
