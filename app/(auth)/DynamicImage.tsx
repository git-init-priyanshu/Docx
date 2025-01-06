"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import SignIn from "@/public/signin.webp";
import SignUp from "@/public/Signup.webp";
import ResetPassword from "@/public/Reset password.webp";
import ForgotPassword from "@/public/Forgot password.webp";
import VerifyOtp from "@/public/Verify otp.webp";

const images = [
  { path: "signin", image: SignIn },
  { path: "signup", image: SignUp },
  { path: "reset-password", image: ResetPassword },
  { path: "forget-password", image: ForgotPassword },
  { path: "otp", image: VerifyOtp },
];
export default function DynamicImage() {
  const url = usePathname();

  const getImageFromRoute = useCallback(() => {
    return images.find((e) => e.path === url.split("/")[1])?.image || "";
  }, [url]);

  const [currentImage, setCurrentImage] = useState(getImageFromRoute());

  useEffect(() => {
    setCurrentImage(getImageFromRoute());
  }, [getImageFromRoute, url]);

  return (
    <Image
      src={currentImage}
      alt="Image"
      className="h-full w-full dark:brightness-[0.2] dark:grayscale bg-white"
    />
  );
}
