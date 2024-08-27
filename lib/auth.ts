import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/prisma/prismaClient";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account?.provider === "google") {
        const {
          email,
          email_verified,
          picture,
          name,
          given_name,
          family_name,
        } = profile;

        if (!email_verified) return false;

        try {
          const username = given_name + family_name;

          await prisma.user.upsert({
            where: { email },
            update: {
              isVerified: true,
            },
            create: {
              name: name,
              username: username,
              email: email,
              password: null,
              picture,
              isVerified: true,
            },
          });

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
      return true;
    },
    session: async ({ session }: any) => {
      if (session.user) {
        const user = await prisma.user.findFirst({
          where: { email: session.user.email },
        });
        session.user.id = user?.id;
      }
      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthOptions;
