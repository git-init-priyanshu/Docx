'use server'

import { cookies } from "next/headers"
import { z } from 'zod';
import { JWTPayload, SignJWT, importJWK } from 'jose';
// @ts-ignore
import bcrypt from 'bcryptjs';

import prisma from "@/prisma/prismaClient";
import { signinSchema, signupSchema } from './zodSchema';

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || 'secret';

  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(jwk);

  return jwt;
};

export const SignupAction = async (data: z.infer<typeof signupSchema>) => {
  try {
    // User validation
    const user = await prisma.user.findFirst({
      where: {
        email: data.email
      }
    })
    if (user && user.password) return {
      success: false,
      error: "Looks like you already have an account",
    };

    // Hashing password
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const jwtPayload = {
      id: user?.id,
      email: data.email,
      name: user?.name,
      picture: user?.picture
    }
    const authToken = await generateJWT(jwtPayload);

    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        password: hashedPassword 
      },
      create: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      }
    })

    // Setting the cookie
    cookies().set('token', authToken, { httpOnly: true });

    return { success: true, data: authToken }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" }
  }
}

export const SigninAction = async (data: z.infer<typeof signinSchema>) => {
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

    const jwtPayload = {
      id: user?.id,
      email: data.email,
      name: user?.name,
      picture: user?.picture
    }
    const authToken = await generateJWT(jwtPayload);

    // Setting the cookie
    cookies().set('token', authToken, { httpOnly: true });

    return { success: true, data: authToken }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" }
  }
}
