import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import { NextAuthProvider } from "./NextAuthProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docx",
  description:
    "An open-source alternative to Google Docs, that lets you write and customize your docs collaboratively with others",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <NextAuthProvider>
          <body
            className={cn(
              "min-h-screen bg-slate-50 font-sans antialiased",
              inter.className,
            )}
          >
            <Toaster />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </NextAuthProvider>
      </html>
    </ReactQueryProvider>
  );
}
