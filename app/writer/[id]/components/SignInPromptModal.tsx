"use client";

import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SignInPromptModal({ open, onClose }: Props) {
  const router = useRouter();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/25" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[400px] max-w-[90vw] rounded-xl border shadow-2xl bg-[var(--lp-card)] border-[var(--lp-border)] p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--lp-muted)] hover:text-[var(--lp-ink)] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--lp-accent-soft)] mb-4">
          <Sparkles size={18} className="text-[var(--lp-accent)]" />
        </div>

        <h2 className="text-[17px] font-semibold mb-1.5 text-[var(--lp-ink)]">
          Sign in to use AI features
        </h2>
        <p className="text-[13.5px] leading-relaxed mb-5 text-[var(--lp-muted)]">
          AI writing tools require an account. It&apos;s free to sign up and takes less than a minute.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/signin")}
            className="flex-1 h-9 rounded-lg text-[13.5px] font-medium bg-[var(--lp-accent)] text-white hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="flex-1 h-9 rounded-lg border text-[13.5px] font-medium hover:bg-[var(--lp-paper-2)] transition-colors bg-[var(--lp-card)] border-[var(--lp-border)] text-[var(--lp-ink)]"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
