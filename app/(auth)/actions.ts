"use server";

import { cookies } from "next/headers";
import { z } from "zod";
// @ts-ignore
import bcrypt from "bcryptjs";
// @ts-ignore
import otpGenerator from 'otp-generator';

import prisma from "@/prisma/prismaClient";
import EmailVerificationMailTemplate from "@/lib/mail/EmailVerificationMailTemplate";
import { SendMail } from "@/lib/mail/sendMail";
import { signinSchema, signupSchema } from "./zodSchema";
import { generateJWT } from "@/helpers/generateJWT";
import type { User } from "@prisma/client";
import PasswordResetMailTemplate from "@/lib/mail/resetPasswordMailTemplate";

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

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Setting expiry of 24 hours

    // Adding unverified users to the DB
    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
      },
      create: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
      },
    });

    // Send mail for email verification
    const mail = await SendMail(
      data.email,
      'DocX | OTP verification',
      EmailVerificationMailTemplate({ verifyCode: otp })
    );
    if (!mail.success) return { success: false, error: mail.error }

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

const ExpireOtp = async (user: User, isVerified: boolean) => {
  if (!user.verifyCodeExpiry) throw new Error;

  const expiredDate = new Date();
  expiredDate.setHours(user.verifyCodeExpiry.getHours() - 24)

  await prisma.user.update({
    where: { email: user.email },
    data: {
      isVerified,
      verifyCodeExpiry: expiredDate
    }
  })
}

export const verifyEmail = async (inputOtp: string, userEmail: string) => {
  let errorMsg = "";

  try {
    const user = await prisma.user.findFirst({ where: { email: userEmail } })
    if (!user) {
      errorMsg = "User does not exist";
    }
    else if (user.isVerified) {
      await ExpireOtp(user, false);
      errorMsg = "User already verified";
    }
    else if (!user.verifyCode || !user.verifyCodeExpiry) {
      await ExpireOtp(user, false);
      errorMsg = "OTP not sent to the user's mail";
    }
    else if (user.verifyCodeExpiry < new Date()) {
      await ExpireOtp(user, false);
      errorMsg = "OTP expired";
    }
    else if (user.verifyCode === inputOtp) {
      await ExpireOtp(user, false);

      const jwtPayload = {
        id: user?.id,
        email: user.email,
        name: user?.name,
        picture: user?.picture,
      };
      const authToken = await generateJWT(jwtPayload);

      // Setting the cookie to grand access
      cookies().set("token", authToken, { httpOnly: true });
      return { success: true, data: "Email successfully verified" };
    } else {
      await ExpireOtp(user, false);
      errorMsg = "Wrong OTP"
    }
    return { success: false, error: errorMsg }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}

export const resendVerifyCode = async (userEmail: string) => {
  let errorMsg = "";

  try {
    const user = await prisma.user.findFirst({ where: { email: userEmail } })
    if (!user) {
      errorMsg = "User does not exist";
    }
    else if (user.isVerified) {
      await ExpireOtp(user, false);
      errorMsg = "User already verified";
    }
    else {
      // Expire the previous otp
      await ExpireOtp(user, false);

      // Generate new otp
      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // Setting expiry of 24 hours

      await prisma.user.update({
        where: { email: userEmail },
        data: {
          verifyCode: otp,
          verifyCodeExpiry: expiryDate,
        },
      });

      // Sending mail
      const mail = await SendMail(
        userEmail,
        'DocX | OTP verification',
        EmailVerificationMailTemplate({ verifyCode: otp })
      );
      if (!mail.success) return { success: false, error: mail.error }

      return { success: true, data: "Verification code sent to the mail." }
    }
    return { success: false, error: errorMsg }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}

export const sendResetPasswordMail = async (userEmail: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    if (!user)
      return {
        success: false,
        error: "Looks like you don't have an account",
      };

    const mail = await SendMail(
      userEmail,
      'DocX | Reset Password',
      PasswordResetMailTemplate({ resetPasswordLink: `http://localhost:3000/reset-password/${user.id}` })
    );
    if (!mail.success) return { success: false, error: mail.error }

    return { success: true, data: "Reset password link sent to the mail." };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}

export const resetPassword = async (userId: any, newPassword: string) => {
  try {

    return { success: true, data: "Password reset successfully." };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
