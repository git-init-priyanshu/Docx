"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { SignupAction } from "../actions"
import { signupSchema } from '../zodSchema'
import { toast } from "sonner"

export default function Signup() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<z.infer<typeof signupSchema>>();

  const submitForm = async (data: z.infer<typeof signupSchema>) => {
    const parsedData = signupSchema.parse({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password
    })

    const response = await SignupAction(parsedData);
    if (response.success) {
      toast.success("Signup completed")
      router.push('/')
    } else {
      toast.error(response.error)
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-500">Signup</h1>
        <p className="text-balance text-muted-foreground">
          Enter your credentials below to login to your account
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit(submitForm)}>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            placeholder="JohnDoe"
            {...register('username', { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="John Doe"
            {...register('name', { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="m@example.com"
            {...register('email', { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            {...register('password', { required: true })}
          />
        </div>
        <Button type="submit" className="w-full bg-blue-500">
          Signup
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  )
}
