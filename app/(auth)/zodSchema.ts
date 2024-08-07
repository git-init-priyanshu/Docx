import { z } from 'zod'

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const signupSchema = z.object({
  name: z.string().min(1).max(50),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(1).regex(passwordValidation)
})

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
