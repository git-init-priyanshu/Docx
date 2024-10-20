'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

import LoaderButton from "@/components/LoaderButton";
import { Input } from "@/components/ui/input";
import { resendVerifyCode, verifyEmail } from "../../actions";

export default function OTP() {
  const params = useParams();
  const router = useRouter();

  const userEmail = params.id.toString().replace("%40", "@");

  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // clearInterval(interval);
          return 0;
        } return prev - 1;
      })
    }, 1000)

    return () => {
      clearInterval(interval);
    }
  }, [])

  const verify = async () => {
    setIsSubmitting(true);
    try {
      const response = await verifyEmail(inputValue, userEmail);
      if (response.success) {
        toast.success(response.data);
        router.push(`/document`)
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
  }

  const resendCode = async () => {
    setIsResending(true);
    try {
      const response = await resendVerifyCode(userEmail);
      if (response.success) {
        toast.success(response.data);
        setTimer(121);
        setIsResending(false);
      } else {
        console.log(response.error);
        toast.error(response.error);
        setIsResending(false);
      }
    } catch (e) {
      console.log(e);
      setIsResending(false);
    }
  }
  return (
    <>
      <div className="flex flex-col gap-2 text-center items-center">
        <MailCheck size={48} color="#3b82f6" />
        <h1 className="text-3xl font-bold">
          <span className="text-black">Please check your&nbsp;</span>
          <span className="text-blue-500">mail</span>
        </h1>
        <p className="text-muted-foreground text-nowrap">
          We&apos;ve sent a code to {userEmail}
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-end text-sm">
        <Input
          placeholder="Enter verification code here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <LoaderButton
          className="w-full bg-blue-500 hover:bg-blue-600"
          isLoading={isSubmitting}
          onClickFunc={verify}
        >
          Verify
        </LoaderButton>
        {timer === 0
          ? <button
            className="text-blue-500 hover:underline cursor-pointer flex w-full justify-end"
            disabled={isResending}
            onClick={resendCode}
          >
            {isResending ?
              < svg
                className="animate-spin lucide lucide-loader-circle mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              : <></>}
            Resend code
          </button>
          : <p>
            Resend code in:{" "}
            {Math.floor(timer / 60)}:
            {timer - Math.floor(timer / 60) * 60 < 10
              ? "0" + String(timer - Math.floor(timer / 60) * 60)
              : timer - Math.floor(timer / 60) * 60
            }
          </p>
        }
      </div >
    </>
  );
}
