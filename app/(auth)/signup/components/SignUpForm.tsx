"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ZodError } from "zod";

import { SignupAction } from "../../actions";
import { signupSchema } from "../../zodSchema";
import {
  Field,
  TextInput,
  PasswordInput,
  PasswordStrength,
} from "../../components/AuthFormControls";

type SignUpValues = {
  name: string;
  email: string;
  password: string;
};

/**
 * Backend requires a `username`, but the new design only collects name + email
 * + password. We derive a stable username from the email's local part — it
 * doesn't have to be unique per the Prisma schema.
 */
function deriveUsername(name: string, email: string) {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z0-9_]/g, "");
  if (cleaned) return cleaned.slice(0, 20);
  return name.replace(/\s+/g, "").slice(0, 20) || "user";
}

export default function SignUpForm() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SignUpValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);
  const [regexError, setRegexError] = useState(false);

  const passwordValue = watch("password") ?? "";

  const submitForm = async (data: SignUpValues) => {
    if (!agree) return;
    setIsSubmitting(true);
    setRegexError(false);
    try {
      const parsed = signupSchema.safeParse({
        name: data.name,
        username: deriveUsername(data.name, data.email),
        email: data.email,
        password: data.password,
      });

      if (!parsed.success) {
        const passwordIssue = parsed.error.issues.find(
          (i) => i.path[0] === "password",
        );
        if (passwordIssue) setRegexError(true);
        else toast.error("Please check the form and try again.");
        setIsSubmitting(false);
        return;
      }

      const response = await SignupAction(parsed.data);
      if (response.success) {
        toast.success("Account created. Please verify your email.");
        router.push(`/otp/${data.email}`);
      } else {
        toast.error(response.error ?? "Could not create your account.");
        setIsSubmitting(false);
      }
    } catch (e: ZodError | unknown) {
      console.log(e);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 mt-5" onSubmit={handleSubmit(submitForm)}>
      <Field label="Full name" htmlFor="name">
        <TextInput
          id="name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          {...register("name", { required: true })}
        />
      </Field>

      <Field label="Work email" htmlFor="email">
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
        error={
          regexError
            ? "Use 8+ chars with upper, lower, number, and a symbol."
            : undefined
        }
      >
        <PasswordInput
          id="password"
          minLength={8}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register("password", { required: true })}
        />
        <PasswordStrength value={passwordValue} />
      </Field>

      <label className="flex items-start gap-2 text-[12px] text-[var(--lp-muted)] select-none cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="accent-[var(--lp-accent)] w-3.5 h-3.5 mt-0.5"
        />
        <span className="leading-snug">
          I agree to the{" "}
          <Link
            href="/"
            className="text-[var(--lp-ink)] underline hover:text-[var(--lp-accent)] transition-colors"
          >
            Terms
          </Link>{" "}
          and acknowledge the{" "}
          <Link
            href="/"
            className="text-[var(--lp-ink)] underline hover:text-[var(--lp-accent)] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={!agree || isSubmitting}
        className="w-full h-11 rounded-md bg-[var(--lp-ink)] text-[var(--lp-paper)] text-[13.5px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            Creating your workspace…
          </>
        ) : (
          <>
            Create account <span aria-hidden>→</span>
          </>
        )}
      </button>
    </form>
  );
}
