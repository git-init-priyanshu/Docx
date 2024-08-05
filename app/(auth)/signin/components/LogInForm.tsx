import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LoginAction } from "../../actions"
import { loginSchema } from '../../zodSchema'
import { toast } from "sonner"


export default function LogInForm() {
  const router = useRouter()

  const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>();

  const submitForm = async (data: z.infer<typeof loginSchema>) => {
    const parsedData = loginSchema.parse({
      email: data.email,
      password: data.password
    })
    const response = await LoginAction(parsedData);
    if (response.success) {
      toast.success("login completed")
      router.push('/')
    } else {
      toast.error(response.error)
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
      <Button type="submit" className="w-full bg-blue-500">
        Login
      </Button>
    </form>
  )
}
