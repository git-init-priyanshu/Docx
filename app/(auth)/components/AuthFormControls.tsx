"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Label + slot + optional inline action / hint / error wrapper. Matches the
 * top-row layout from the design (label on the left, action like "Forgot?"
 * on the right).
 */
export function Field({
  label,
  hint,
  error,
  children,
  action,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  action?: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={htmlFor}
          className="text-[12.5px] font-medium text-[var(--lp-ink)]"
        >
          {label}
        </label>
        {action}
      </div>
      {children}
      {hint && !error && (
        <div className="text-[11.5px] text-[var(--lp-muted)] mt-1.5">
          {hint}
        </div>
      )}
      {error && (
        <div className="text-[11.5px] text-[var(--lp-rose)] mt-1.5">
          {error}
        </div>
      )}
    </div>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={
        "w-full h-11 px-3.5 rounded-md bg-[var(--lp-card)] border border-[var(--lp-border)] text-[13.5px] text-[var(--lp-ink)] outline-none focus:border-[var(--lp-accent)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--lp-accent)_25%,transparent)] transition placeholder:text-[var(--lp-muted)] " +
        className
      }
    />
  );
});

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-[var(--lp-muted)] hover:text-[var(--lp-ink)] hover:bg-[var(--lp-paper-2)] transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
});

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <span className="flex-1 h-px bg-[var(--lp-border)]" />
      <span className="font-mono text-[10.5px] text-[var(--lp-muted)] uppercase tracking-wider">
        {children}
      </span>
      <span className="flex-1 h-px bg-[var(--lp-border)]" />
    </div>
  );
}

const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Strong", "Excellent"];
const STRENGTH_COLORS = [
  "var(--lp-rose)",
  "var(--lp-rose)",
  "var(--lp-tan)",
  "var(--lp-leaf)",
  "var(--lp-leaf)",
];

function scorePassword(value: string) {
  if (!value) return 0;
  let s = 0;
  if (value.length >= 8) s++;
  if (/[A-Z]/.test(value)) s++;
  if (/[0-9]/.test(value)) s++;
  if (/[^A-Za-z0-9]/.test(value)) s++;
  return s;
}

/**
 * Four-bar strength meter shown beneath the password field on sign-up. Mirrors
 * the heuristic from the design (length + uppercase + digit + symbol).
 */
export function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  const filledColor = STRENGTH_COLORS[score];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{
              background: i < score ? filledColor : "var(--lp-border)",
            }}
          />
        ))}
      </div>
      <div className="font-mono text-[10.5px] text-[var(--lp-muted)] mt-1">
        {value
          ? STRENGTH_LABELS[score]
          : "8+ chars, mix of letters, numbers, symbols"}
      </div>
    </div>
  );
}
