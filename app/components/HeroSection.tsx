import Link from "next/link";
import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google"

import logo from "@/public/logo.svg";
import editor from "@/public/editor.png"
import documents from "@/public/documents.png"

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"]
})
export default function HeroSection() {
  return (
    <>
      <nav className="absolute top-5 flex w-full justify-between items-center px-4 md:px-6 lg:px-6 2xl:px-20">
        <div className="flex gap-2 items-end justify-center">
          <Image src={logo} width={45} alt="logo" />
          <p className={`${roboto.className} hidden sm:block text-lg text-neutral-600`}>DocX</p>
        </div>
        <div className="flex gap-4 z-10">
          <Link
            href="/signin"
            className="z-10 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 sm:px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:border-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Signin
          </Link>
          <Link
            href="/signup"
            className="z-10 inline-flex h-10 items-center bg-blue-500 justify-center rounded-md px-4 sm:px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Signup
          </Link>
        </div>
      </nav>
      <section className="relative w-full bg-background p-40">
        <div className="container flex items-center justify-center text-center w-full px-4 md:mt-40 md:px-6 lg:mt-0 mb-[15rem]">
          <div className="relative flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl pt-4 font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-transparent bg-clip-text bg-gradient-to-br from-neutral-500 to-neutral-800">
                <span className="flex justify-center">
                  <p>Unlock the&nbsp;</p>
                  <p className="text-blue-500 relative">Power
                    <span className="absolute inset-x-0 w-3/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
                  </p>
                </span>
                <p className="pt-2 pb-4">of Collaborative Editing</p>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                DocX is an open-source Google Docs alternative that empowers teams to create, edit, and share
                documents seamlessly.
              </p>
            </div>
            <div className="flex justify-center flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/signup"
                className="z-10 inline-flex h-10 items-center bg-blue-500 justify-center rounded-md px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Try DocX
              </Link>
              <Link
                href="#"
                className="z-10 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:border-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute mx-auto grid place-items-center transform -translate-y-[10rem]">
          <Image
            src={editor}
            alt="screenshots"
            className="w-[70%] border rounded-lg shadow-lg -translate-x-[20%]"
          />
          <Image
            src={documents}
            alt="screenshots"
            className="w-[50%] border rounded-lg transform -translate-y-[85%] translate-x-[30%] shadow-lg"
          />
        </div>
      </section>
    </>
  )
}
