"use client"

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import editor from "@/public/editor.png";
import documents from "@/public/documents.png";

export default function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.8 1"]
  });
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const textProgress = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"])
  const imageProgress = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"])

  return (
    <div ref={ref} className="py-20 grid place-items-center">

      <motion.h2
        className="text-4xl z-[-5] text-center font-bold text-neutral-600"
        style={{
          y: textProgress,
          opacity: opacityProgress,
        }}
      >Seamless <span className="text-blue-500">Collaboration </span>with<br /> Intuitive Interface.
      </motion.h2>

      <motion.div
        style={{ y: imageProgress }}
        className="relative w-[70%] mt-64 border rounded-lg shadow-lg "
      >
        <motion.div
          className="shimmer absolute h-[1.5px] w-[20%] bg-white left-[30%] transform -translate-x-1/2 "
          style={{
            background: "radial-gradient(50% 3972% at 50% 50%, rgba(9, 170, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)"
          }}
          animate={{ left: ["70%", "30%", "70%"] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        >
        </motion.div>

        <motion.div
          className="glow absolute h-16 top-[0%] left-[50%] transform -translate-x-[50%] blur-[50px] z-[-1] rounded-[8px] overflow-hidden w-[100%] opacity-70"
          style={{
            opacity: opacityProgress,
            background: "radial-gradient(50% 50% at 50% 50%, rgb(0 102 255) 50%, rgba(171, 171, 171, 0) 100%)"
          }}
        ></motion.div>
        <motion.div
          className="glow absolute h-52 top-[-10%] left-[50%] transform -translate-x-[50%] blur-[100px] z-[-1] rounded-[8px] overflow-hidden w-[100%] opacity-90"
          style={{
            opacity: opacityProgress,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 102, 255, 0.3) 0%, rgba(171, 171, 171, 0) 100%)"
          }}
        ></motion.div>
        <motion.div
          className="glow absolute h-52 top-[-10%] left-[50%] transform -translate-x-[50%] blur-[100px] z-[-1] rounded-[8px] overflow-hidden w-[55%] opacity-50"
          style={{
            opacity: opacityProgress,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 102, 255, 0.3) 0%, rgba(171, 171, 171, 0) 100%)"
          }}
        ></motion.div>
        <Image
          src={editor}
          alt="screenshots"
          className="z-10 shadow-lg rounded-md"
        />
      </motion.div>
      <Image
        src={documents}
        alt="screenshots"
        className="w-[40%] absolute border rounded-lg transform translate-y-[50%] translate-x-[50%] shadow-lg"
      />
    </div>
  )
}
