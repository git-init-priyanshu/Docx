"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SigninAction } from "../../actions";
import { signinSchema } from "../../zodSchema";
import {
  Field,
  TextInput,
  PasswordInput,
} from "../../components/AuthFormControls";

type SignInValues = z.infer<typeof signinSchema>;

export default function SignInForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignInValues>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);

  const submitForm = async (data: SignInValues) => {
    setIsSubmitting(true);
    try {
      const parsedData = signinSchema.parse({
        email: data.email,
        password: data.password,
      });
      const response = await SigninAction(parsedData);
      if (response.success) {
        toast.success("login completed");
        router.push("/document");
      } else {
        toast.error(response.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 mt-5" onSubmit={handleSubmit(submitForm)}>
      <Field label="Email" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          placeholder="you@studio.com"
          autoComplete="email"
          {...register("email", { required: true })}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        action={
          <Link
            href="/forget-password"
            className="text-[11.5px] text-[var(--lp-muted)] hover:text-[var(--lp-accent)] transition-colors"
          >
            Forgot?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password", { required: true })}
        />
      </Field>

      <label className="flex items-center gap-2 text-[12.5px] text-[var(--lp-muted)] select-none cursor-pointer">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="accent-[var(--lp-accent)] w-3.5 h-3.5"
        />
        Keep me signed in for 30 days
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-md bg-[var(--lp-ink)] text-[var(--lp-paper)] text-[13.5px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 4a8 8 0 0 1 8 8" strokeLinecap="round" />
            </svg>
            Signing you in…
          </>
        ) : (
          <>
            Sign in <span aria-hidden>→</span>
          </>
        )}
      </button>
    </form>
  );
}
