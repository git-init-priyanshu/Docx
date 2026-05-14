import AuthShell from "../components/AuthShell";
import AuthAside from "../components/AuthAside";
import SocialButton from "../components/SocialButton";

export default function Login() {
  return (
    <AuthShell aside={<AuthAside />}>
      <div className="mb-8">
        <div className="font-mono text-[10.5px] text-[var(--lp-muted)] uppercase tracking-[0.18em] mb-2">
          Login
        </div>
        <h1 className="text-[32px] leading-[1.1] tracking-[-0.03em] font-semibold text-[var(--lp-ink)]">
          Welcome to DocX.
        </h1>
        <p className="text-[14px] text-[var(--lp-muted)] mt-2">
          Continue with Google to pick up where you left off.
        </p>
      </div>

      <div className="space-y-3">
        <SocialButton provider="google">Continue with Google</SocialButton>
      </div>

      <p className="text-center mt-7 text-[12px] text-[var(--lp-muted)] leading-relaxed">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </AuthShell>
  );
}
