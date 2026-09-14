import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import { NextAuthProvider } from "./NextAuthProvider";
import { Providers } from "./Providers";
import ReactQueryProvider from "./ReactQueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const title = "DocX: an open-source Google Docs alternative";
const description =
  "An open-source alternative to Google Docs, that lets you write and customize your docs collaboratively with others";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: { default: "DocX", template: "%s · DocX" },
  description,
  openGraph: {
    type: "website",
    siteName: "DocX",
    url: "/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en" suppressHydrationWarning>
        <NextAuthProvider>
          <Providers>
            <body
              className={cn(
                "min-h-screen font-sans antialiased",
                inter.variable,
                jetbrainsMono.variable,
                inter.className,
              )}
            >
              <Toaster />
              <Analytics />
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </body>
          </Providers>
        </NextAuthProvider>
      </html>
    </ReactQueryProvider>
  );
}
