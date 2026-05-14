import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/prisma/prismaClient";

/**
 * Process-level email → user.id cache. The `jwt` callback runs on every
 * `getServerSession` call but can't write cookies back from a React Server
 * Component, so without this cache we'd hit Prisma (Neon cold-start ≈ 5s) on
 * every page render until the session cookie happens to roll over via the
 * client `/api/auth/session` endpoint.
 */
const userIdByEmail = new Map<string, string>();

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
          const fromGiven = `${given_name ?? ""}${family_name ?? ""}`;
          const fallback =
            (name ?? email?.split("@")[0] ?? "user")
              .replace(/\s+/g, "")
              .slice(0, 20) || "user";
          const username = (fromGiven || fallback).slice(0, 20);

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
          console.error("[next-auth] Google signIn upsert failed:", e);
          return false;
        }
      }
      return true;
    },
    jwt: async ({ token }: any) => {
      if (token.id || !token.email) return token;

      const cached = userIdByEmail.get(token.email);
      if (cached) {
        token.id = cached;
        return token;
      }

      try {
        const dbUser = await prisma.user.findFirst({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          userIdByEmail.set(token.email, dbUser.id);
        }
      } catch (e) {
        console.error("[next-auth] jwt id lookup failed:", e);
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return `${baseUrl}/document`;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;
