import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from 'react-hook-form'
import Link from "next/link"
import { z } from 'zod'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { SigninAction } from "../../actions"
import { signinSchema } from '../../zodSchema'
import { toast } from "sonner"
import LoaderButton from "@/components/LoaderButton"


export default function LogInForm() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<z.infer<typeof signinSchema>>();

  const submitForm = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const parsedData = signinSchema.parse({
      email: data.email,
      password: data.password
    })
    const response = await SigninAction(parsedData);
    if (response.success) {
      toast.success("login completed")
      router.push('/')
      setIsSubmitting(false);
    } else {
      toast.error(response.error)
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4 text-left" onSubmit={handleSubmit(submitForm)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="johndoe@email.com"
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
      <LoaderButton
        className="w-full bg-blue-500 hover:bg-blue-600"
        isLoading={isSubmitting}
        type="submit"
      >Sign in</LoaderButton>
    </form>
  )
}
