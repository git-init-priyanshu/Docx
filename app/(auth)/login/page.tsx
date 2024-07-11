"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LoginAction } from "../actions"
import { loginSchema } from '../zodSchema'
import { toast } from "sonner"
import { resolve } from "path"

export default function Signup() {
  const router = useRouter()

  const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>();

  const submitForm = async (data: z.infer<typeof loginSchema>) => {
    const parsedData = loginSchema.parse({
      email: data.email,
      password: data.password
    })
    const response = await LoginAction(parsedData);
    if(response.success){
      toast.success("Signup completed")
      router.push('/')
    }else{
      toast.error(response.error)
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-500">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="m@example.com"
            {...register('email', { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            type="password"
            {...register('password', { required: true })}
          />
        </div>
        <Button type="submit" className="w-full bg-blue-500">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </>
  )
}
