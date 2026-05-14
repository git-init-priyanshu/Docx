import Link from "next/link";

import AuthShell from "../components/AuthShell";
import AuthAside from "../components/AuthAside";
import SocialButton from "../components/SocialButton";
import { Divider } from "../components/AuthFormControls";
import SignInForm from "./components/SignInForm";

export default function SignIn() {
  return (
    <AuthShell aside={<AuthAside />}>
      <div className="mb-8">
        <div className="font-mono text-[10.5px] text-[var(--lp-muted)] uppercase tracking-[0.18em] mb-2">
          Sign in
        </div>
        <h1 className="text-[32px] leading-[1.1] tracking-[-0.03em] font-semibold text-[var(--lp-ink)]">
          Welcome back.
        </h1>
        <p className="text-[14px] text-[var(--lp-muted)] mt-2">
          Sign in to keep writing where you left off.
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <SocialButton provider="google">Continue with Google</SocialButton>
      </div>

      <Divider>or with email</Divider>

      <SignInForm />

      <div className="text-center mt-7 text-[13px] text-[var(--lp-muted)]">
        New to DocX?{" "}
        <Link
          href="/signup"
          className="text-[var(--lp-ink)] font-medium hover:text-[var(--lp-accent)] transition-colors"
        >
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}
