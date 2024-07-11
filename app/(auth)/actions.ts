'use server'

import { z } from 'zod';
// @ts-ignore
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

import prisma from "@/prisma/prismaClient";
import { loginSchema, signupSchema } from './zodSchema';

const getJwtToken = (email: string) => {
  return jwt.sign({
    user: {
      email: email
    }
  }, String(process.env.JWT_SECRET));
}

export const SignupAction = async (data: z.infer<typeof signupSchema>) => {
  try {
    // User validation
    const isUserExist = await prisma.user.findFirst({
      where: {
        email: data.email
      }
    })
    if (isUserExist) return {
      success: false,
      error: "Looks like you already have an account",
    };

    // Hashing password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const authToken = getJwtToken(data.email);

    await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        isVerified: true,
        verifyToken: authToken
      }
    })

    return { success: true, data: authToken }
  } catch (e) {
    return { success: false, error: "Internal server error" }
  }
}

export const LoginAction = async (data: z.infer<typeof loginSchema>) => {
  try {
    // User validation
    const user = await prisma.user.findFirst({
      where: {
        email: data.email
      }
    })
    if (!user) return {
      success: false,
      error: "Looks like you don't have an account",
    };

    // Password validation
    const isCorrectPassword = await bcrypt.compare(data.password, user.password);
    if (!isCorrectPassword) return {
      success: false,
      error: "Invalid credentials",
    }

    const authToken = getJwtToken(data.email);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: authToken
      }
    })

    return { success: true, data: authToken }
  } catch (e) {
    return { success: false, error: "Internal server error" }
  }
}
