import Link from "next/link";
import Image from "next/image";
import { Montserrat_Alternates as Montserrat } from "next/font/google";
import * as motion from "framer-motion/client";

import logo from "@/public/logo.svg";
import LoopWords from "@/components/LoopWords";
import HeroImage from "@/components/HeroImage";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"],
});
export default function HeroSection() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-full h-52 top-[-18%] left-[50%] transform -translate-x-[50%] blur-[100px] z-10"
        style={{
          background: "radial-gradient(circle, rgba(0, 102, 255, 0.3) 70%, transparent 80%)"
        }}
      ></motion.div>
      <nav className="absolute top-5 flex w-full justify-between items-center px-4 md:px-6 lg:px-6 2xl:px-20">
        <motion.div
          variants={HeroVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
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
                delay: 0.5,
                duration: 0.4,
                ease: "easeInOut"
              }}
              className={`${roboto.className} hidden sm:block text-lg text-neutral-600 `}
            >
              DocX
            </motion.p>
          </div>

        </motion.div>
        <motion.div
          className="flex gap-4 z-10"
          initial={{
            y: -100
          }}
          animate={{
            y: 0
          }}
          transition={{ delay: 0.5 }}
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

      <section className="relative flex items-center h-screen w-full bg-background p-40 px-4 border-b md:px-6 lg:px-6 2xl:px-20">
        <div className="flex items-center justify-center text-center w-full px-4 md:mt-40 md:px-6 lg:mt-0 ">
          <div className="relative flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                variants={HeroVariant}
                initial="hidden"
                animate="visible"
                transition={{
                  opacity: { duration: 0.2 },
                  y: { duration: 1 }
                }}
                className="text-3xl pt-4 font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-transparent bg-clip-text bg-gradient-to-br from-neutral-500 to-neutral-800"
              >
                <span className="flex justify-center">
                  <p>Unlock the&nbsp;</p>
                  <div className="text-blue-500 overflow-hidden w-40 sm:w-52 md:w-56 lg:w-60 xl:w-64 relative ">
                    <LoopWords words={["Power", "Potential", "Magic"]} />
                    <span className="absolute inset-x-0 w-3/2 mx-auto bottom-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                  </div>
                </span>
                <p className="pt-2 pb-4">of AI-Driven Editing.</p>
              </motion.h1>
              <motion.p
                variants={HeroVariant}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: 1,
                  opacity: { duration: 0.2 },
                  y: { duration: 1 }
                }}
                className="max-w-[650px] text-muted-foreground md:text-xl"
              >
                DocX is an open-source AI powered alternative to Google Docs that empowers
                teams to create, edit, and share documents seamlessly.
              </motion.p>
            </div>
            <motion.div
              variants={HeroVariant}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 1,
                opacity: { duration: 0.2 },
                y: { duration: 1 }
              }}
              className="flex justify-center flex-col gap-8 min-[400px]:flex-row"
            >
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
            </motion.div>
          </div>
        </div>
      </section >

      <HeroImage />
    </>
  );
}

const HeroVariant = {
  hidden: {
    y: 10,
    opacity: 0
  }
  ,
  visible: {
    y: 0,
    opacity: 1
  }
}
