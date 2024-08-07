"use client"

import { useRouter } from "next/navigation"
import { useForm } from 'react-hook-form'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod'

import { signupSchema } from '../../zodSchema'
import { SignupAction } from '../../actions'

export default function CredentialsForm() {
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
      toast.success("Signin completed")
      router.push('/')
    } else {
      console.log(response.error);
      toast.error(response.error);
    }
  };
  return (
    <form className="grid gap-4 text-left" onSubmit={handleSubmit(submitForm)}>
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
        Sign up
      </Button>
    </form>
  )
}
