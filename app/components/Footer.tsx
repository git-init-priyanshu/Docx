"use client";

import Image from "next/image";
import { useRef } from "react";
import { Montserrat_Alternates as Montserrat } from "next/font/google";
import { Github, Star } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import logo from "@/public/logo.svg";

const roboto = Montserrat({
  weight: "500",
  style: "normal",
  subsets: ["cyrillic"],
});
export default function Footer() {
  const footerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["0 1", "1 1"],
  });

  const footerProgress = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);

  return (
    <motion.footer
      ref={footerRef}
      style={{ y: footerProgress }}
      className="flex z-0 justify-between py-20  px-4 md:px-6 lg:px-6 2xl:px-20"
    >
      <div>
        <div className="flex gap-2 items-end mb-2">
          <Image src={logo} alt="logo" width={40} />
          <p
            className={`${roboto.className} hidden sm:block text-lg text-neutral-600 `}
          >
            DocX
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Copyright &copy; 2025 DocX. <br /> All rights reserved.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10 items-start mt-10">
        <div className="flex justify-center space-y-4 flex-col">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            Features
          </a>
          <a
            href="https://github.com/git-init-priyanshu/Docx"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            Open Source
          </a>
        </div>

        <div className="flex justify-center space-y-4 flex-col">
          <a className="text-sm text-muted-foreground hover:text-black no-underline">
            Privacy Policy
          </a>
          <a className="text-sm text-muted-foreground hover:text-black no-underline">
            Terms of Service
          </a>
        </div>

        <div className="flex justify-center space-y-4 flex-col">
          <a
            href="https://github.com/git-init-priyanshu"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            Github
          </a>
          <a
            href="https://x.com/PriyanshuBartw5"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            X ( Twitter )
          </a>
          <a
            href="https://www.linkedin.com/in/priyanshu-bartwal/"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-black no-underline"
          >
            LinkedIn
          </a>
        </div>

        <a
          href="https://github.com/git-init-priyanshu/Docx"
          target="_blank"
          className=" col-span-3 z-10 flex cursor-pointer gap-2 h-10 items-center justify-center rounded-md border bg-background px-4 sm:px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:border-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground"
        >
          <Star size={18} strokeWidth={2} />
          <p>Star us on</p>
          <Github size={18} strokeWidth={2} />
        </a>
      </div>
    </motion.footer>
  );
}
