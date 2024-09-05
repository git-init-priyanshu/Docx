import Link from "next/link";

import SignInForm from "./components/SignInForm";
import GoogleAuthButton from "./components/GoogleAuthButton";

export default function Login() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">
          <span className="text-black">Sign&nbsp;</span>
          <span className=" text-blue-500">in</span>
        </h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-center text-sm">
        <SignInForm />
        <p className="divider">OR</p>
        <GoogleAuthButton />
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
