"use server";

import { cookies } from "next/headers";
import { z } from "zod";
// @ts-ignore
import bcrypt from "bcryptjs";

import prisma from "@/prisma/prismaClient";
import EmailVerificationMailTemplate from "@/lib/mail/EmailVerificationMailTemplate";
import { SendMail } from "@/lib/mail/sendMail";
import { signinSchema, signupSchema } from "./zodSchema";
import { generateJWT } from "@/helpers/generateJWT";

export const SignupAction = async (data: z.infer<typeof signupSchema>) => {
  try {
    // User validation
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (user && user.password)
      return {
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
      picture: user?.picture,
    };
    const authToken = await generateJWT(jwtPayload);

    // Adding unverified users to the DB
    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        password: hashedPassword,
      },
      create: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Send mail for email verification
    await SendMail(
      'bartwalpriyanshu00@gmail.com',
      'DocX | OTP verification',
      EmailVerificationMailTemplate({ validationCode: "1234" })
    );

    // Setting the cookie
    cookies().set("token", authToken, { httpOnly: true });

    return { success: true, data: authToken };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const SigninAction = async (data: z.infer<typeof signinSchema>) => {
  try {
    // User validation
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user)
      return {
        success: false,
        error: "Looks like you don't have an account",
      };
    if (!user.password)
      return {
        success: false,
        error: "Invalid credentials",
      };

    // Password validation
    const isCorrectPassword = await bcrypt.compare(
      data.password,
      user.password,
    );
    if (!isCorrectPassword)
      return {
        success: false,
        error: "Invalid credentials",
      };

    const jwtPayload = {
      id: user?.id,
      email: data.email,
      name: user?.name,
      picture: user?.picture,
    };
    const authToken = await generateJWT(jwtPayload);

    // Setting the cookie
    cookies().set("token", authToken, { httpOnly: true });

    return { success: true, data: authToken };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
