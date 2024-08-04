// import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWTPayload, SignJWT, importJWK } from 'jose';
// @ts-ignore
// import bcrypt from 'bcryptjs';

// import prisma from "@/prisma/prismaClient";

// const generateJWT = async (payload: JWTPayload) => {
//   const secret = process.env.JWT_SECRET || 'secret';
//
//   const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
//
//   const jwt = await new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('365d')
//     .sign(jwk);
//
//   return jwt;
// };


export const authOptions: NextAuthOptions = {
  providers: [
    // CredentialsProvider({
    //   name: 'Credentails',
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: 'JohnDoe' },
    //     name: { label: 'Name', type: 'text', placeholder: 'John Doe' },
    //     email: { label: 'Email', type: 'email', placeholder: 'johndoe@email.com' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials: any) {
    //     if (!credentials || !credentials.email || !credentials.password) return null;
    //
    //     try {
    //       const user = await prisma.user.findFirst({
    //         where: {
    //           email: credentials.email
    //         },
    //         select: {
    //           password: true,
    //           id: true,
    //           name: true
    //         }
    //       })
    //
    //       const isCorrectPassword = await bcrypt.compare(credentials.password, user?.password);
    //       if (user && user.password && isCorrectPassword) {
    //         const authToken = await generateJWT({ id: user.id });
    //
    //         await prisma.user.update({
    //           where: { id: user.id },
    //           data: {
    //             isVerified: true,
    //             verifyToken: authToken
    //           }
    //         })
    //
    //         // Setting the cookie
    //         // cookies().set('token', authToken, { httpOnly: true });
    //
    //         return {
    //           id: user.id,
    //           name: user.name,
    //           email: credentials.email,
    //           token: authToken,
    //         };
    //       };
    //
    //       return null;
    //     } catch (e) {
    //       console.log(e);
    //       return null;
    //     }
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,

      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async jwt({ token, account }: any) {
    //   if (account) {
    //     token.accessToken = account.access_token
    //   }
    //   return token
    // },
    // async session({ session, token, user }: any) {
    //   if (session.user) {
    //     session.user.id = token.uid
    //   }
    //   return session
    // },
  },
  cookies: {
    sessionToken: {
      name: 'token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthOptions
