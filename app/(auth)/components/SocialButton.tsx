"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

import Google from "@/public/google_icon.svg";

export default function SocialButton({
  provider,
  children,
}: {
  provider: "google";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider)}
      className="h-11 w-full inline-flex items-center justify-center gap-2.5 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] text-[13px] font-medium text-[var(--lp-ink)] hover:bg-[var(--lp-paper-2)] transition-colors"
    >
      {provider === "google" && (
        <Image src={Google} alt="" width={16} height={16} className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
