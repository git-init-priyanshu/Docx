import Link from "next/link";
import { Check } from "lucide-react";

import AuthShell from "../components/AuthShell";
import AuthAside from "../components/AuthAside";
import SocialButton from "../components/SocialButton";
import { Divider } from "../components/AuthFormControls";
import SignUpForm from "./components/SignUpForm";

const PERKS = [
  "Real-time co-authoring",
  "Built-in AI rewrite & summarise",
  "Free for teams under 10",
];

export default function SignUp() {
  return (
    <AuthShell aside={<AuthAside />} side="right">
      <div className="mb-7">
        <div className="font-mono text-[10.5px] text-[var(--lp-muted)] uppercase tracking-[0.18em] mb-2">
          Create an account
        </div>
        <h1 className="text-[32px] leading-[1.1] tracking-[-0.03em] font-semibold text-[var(--lp-ink)]">
          Start writing in under a minute.
        </h1>
        <p className="text-[14px] text-[var(--lp-muted)] mt-2">
          Free for personal use. No credit card needed.
        </p>
      </div>

      <ul className="mb-6 space-y-1.5 text-[12.5px] text-[var(--lp-muted)]">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[var(--lp-leaf)] shrink-0" />
            {perk}
          </li>
        ))}
      </ul>

      <div className="space-y-3 mb-5">
        <SocialButton provider="google">Sign up with Google</SocialButton>
      </div>

      <Divider>or with email</Divider>

      <SignUpForm />

      <div className="text-center mt-7 text-[13px] text-[var(--lp-muted)]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-[var(--lp-ink)] font-medium hover:text-[var(--lp-accent)] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
