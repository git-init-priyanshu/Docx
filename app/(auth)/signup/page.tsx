import Link from "next/link"

import SignUpForm from "./components/SignUpForm"
import GoogleAuthButton from "./components/GoogleAuthButton"

export default function Signup() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-500">Sign up</h1>
        <p className="text-balance text-muted-foreground">
          Enter your credentials below to login to your account
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-center text-sm">
        <SignUpForm />
        <p className="divider">OR</p>
        <GoogleAuthButton />
        <p>
          Already have an account?{" "}
          <Link href="/api/auth/signin" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  )
}
