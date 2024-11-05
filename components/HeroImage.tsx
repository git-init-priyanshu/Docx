"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform
} from "framer-motion";

import Toolbar from "@/public/Toolbar.png";
import Mobile from "@/public/Hero image mobile view.webp";

export default function HeroImage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["0 1", "0.8 1"]
  });

  useEffect(() => {
    scrollYProgress.onChange(() => {
      if (scrollYProgress.get() > 0.6) setIsInView(true);
    });
  }, []);

  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const textProgress = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"])
  const videoProgress = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"])

  return (
    <div ref={containerRef} className="py-20 grid place-items-center">

      <motion.h2
        className="text-4xl z-[-5] text-center font-bold text-neutral-600"
        style={{
          y: textProgress,
          opacity: opacityProgress,
        }}
      >Seamless <span className="text-blue-500">Collaboration </span>with<br /> Intuitive Interface.
      </motion.h2>

      <motion.div
        style={{ y: videoProgress }}
        className="w-[70%] mt-64 border rounded-lg shadow-lg "
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

        <div className="relative">
          <video loop autoPlay preload="auto" muted playsInline className="cursor-auto w-full h-full rounded-md shadow-lg z-10 ">
            <source src="https://utfs.io/f/LdDzZPI8fQBxuaJqilab6xNMD8AjkOU2RVI1zTuyBQLaHdP4" type="video/mp4" />
          </video>

          <motion.div
            className="w-[25%] absolute border rounded-lg shadow-lg top-0"
            initial={{ x: "-40%", y: "80%", opacity: 0.5 }}
            whileInView={{ x: "-40%", y: "50%", opacity: 1 }}
            transition={{
              y: { duration: 0.5 },
              opacity: { duration: 0.3 },
            }}
          >
            <Image
              src={Toolbar}
              alt="Toolbar"
              className="rounded-md"
            />
          </motion.div>
          <motion.div
            className="w-[25%] absolute border rounded-lg shadow-lg top-0 right-0"
            initial={{ x: "40%", y: "50%", opacity: 0.5 }}
            whileInView={{ x: "40%", y: "20%", opacity: 1 }}
            transition={{
              y: { duration: 0.5 },
              opacity: { duration: 0.3 }
            }}
          >
            <Image
              src={Mobile}
              alt="Mobile"
              className="rounded-md"
            />
          </motion.div>
        </div>
      </motion.div>
    </div >
  )
}
