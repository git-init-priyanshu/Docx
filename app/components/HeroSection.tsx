import Link from "next/link";
import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google";
import * as motion from "framer-motion/client";

import logo from "@/public/logo.svg";
import editor from "@/public/editor.png";
import documents from "@/public/documents.png";
import LoopWords from "@/components/LoopWords";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"],
});
export default function HeroSection() {
  return (
    <>
      <div className="glow"></div>
      <nav className="absolute top-5 flex w-full justify-between items-center px-4 md:px-6 lg:px-6 2xl:px-20">
        <div
          className="flex z-10 gap-2 items-end justify-center overflow-hidden"
        >
          <Image src={logo} width={45} alt="logo" />
          <div className="overflow-hidden">
            <motion.p
              initial={{
                x: -100,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 100
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut"
              }}
              className={`${roboto.className} hidden sm:block text-lg text-neutral-600 `}
            >
              DocX
            </motion.p>
          </div>

        </div>
        <motion.div
          className="flex gap-4 z-10"
          initial={{
            y: -100
          }}
          animate={{
            y: 0
          }}
        >
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
        </motion.div>
      </nav >
      <section className="relative w-full bg-background p-40 px-4 md:px-6 lg:px-6 2xl:px-20">
        <div className="container flex items-center justify-center text-center w-full px-4 md:mt-40 md:px-6 lg:mt-0 md:mb-[10rem] lg:mb-[15rem] xl:mb-[20rem] 2xl:mb-[25rem] 3xl:mb-[30rem]">
          <div className="relative flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl pt-4 font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-transparent bg-clip-text bg-gradient-to-br from-neutral-500 to-neutral-800">
                <span className="flex justify-center">
                  <p>Unlock the&nbsp;</p>
                  <div className="text-blue-500 overflow-hidden w-40 sm:w-52 md:w-56 lg:w-60 xl:w-64 relative ">
                    <LoopWords words={["Power", "Potential", "Magic" ]} />
                    <span className="absolute inset-x-0 w-3/2 mx-auto bottom-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                  </div>
                </span>
                <p className="pt-2 pb-4">of AI-Driven Editing.</p>
              </h1>
              <p className="max-w-[650px] text-muted-foreground md:text-xl">
                DocX is an open-source AI powered alternative to Google Docs that empowers
                teams to create, edit, and share documents seamlessly.
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
        <div className="absolute hidden mx-auto md:grid place-items-center transform md:-translate-y-[2rem] lg:-translate-y-[6rem] xl:-translate-y-[12rem] 2xl:-translate-y-[18rem] 3xl:-translate-y-[20rem]">
          <Image
            src={editor}
            alt="screenshots"
            className="w-[70%] border rounded-lg shadow-lg md:-translate-x-[10%]"
          />
          <Image
            src={documents}
            alt="screenshots"
            className="w-[50%] border rounded-lg transform -translate-y-[85%] translate-x-[30%] shadow-lg"
          />
        </div>
      </section>
    </>
  );
}
