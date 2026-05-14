"use client";

import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginPromptModal({ open, onClose }: Props) {
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
          Login to use AI features
        </h2>
        <p className="text-[13.5px] leading-relaxed mb-5 text-[var(--lp-muted)]">
          AI writing tools require an account. It&apos;s free and takes seconds with Google.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="w-full h-9 rounded-lg text-[13.5px] font-medium bg-[var(--lp-accent)] text-white hover:opacity-90 transition-opacity"
        >
          Continue to login
        </button>
      </div>
    </div>
  );
}
