import Link from "next/link";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { Montserrat_Alternates as Montserrat } from "next/font/google";

import logo from "@/public/logo.svg";
import Github from "@/public/github.png";
import { GithubIcon } from "lucide-react";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"],
});
export default function Navbar() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-full h-52 top-[-18%] left-[50%] transform -translate-x-[50%] blur-[100px] z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 102, 255, 0.3) 70%, transparent 80%)",
        }}
      ></motion.div>
      <nav className="absolute top-5 flex w-full justify-between items-center px-4 md:px-6 lg:px-6 2xl:px-20">
        <motion.div
          variants={NavVariant}
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
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 100,
              }}
              transition={{
                delay: 0.5,
                duration: 0.4,
                ease: "easeInOut",
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
            y: -100,
          }}
          animate={{
            y: 0,
          }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="https://github.com/git-init-priyanshu/Docx/"
            className="z-10 w-fit gap-3 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 sm:px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:border-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            {/* <Image src={Github} alt="github" className="w-[8%]" /> */}
            <GithubIcon size={20}/>
            5 stars
          </Link>
          {/* <Link */}
          {/*   href="/signup" */}
          {/*   className="z-10 inline-flex h-10 items-center bg-blue-500 justify-center rounded-md px-4 sm:px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" */}
          {/*   prefetch={false} */}
          {/* > */}
          {/*   <Image src={Github} alt="github" className="w-[8%]"/> */}
          {/* </Link> */}
        </motion.div>
      </nav>
    </>
  );
}

const NavVariant = {
  hidden: {
    y: 10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};
