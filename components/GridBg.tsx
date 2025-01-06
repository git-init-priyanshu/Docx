"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const maskSize = 300;
const commonClass = "absolute w-full h-dvh opacity-30";
const commonStyle = {
  background: "url('/grid_bg.svg')",
  backgroundSize: "200px",
  WebkitMaskImage: "url('/mask.svg')",
  WebkitMaskRepeat: "no-repeat",
  filter: "blur(1px)",
};
export default function GridBg() {
  const [cursorPosX, setCursorPosX] = useState(0);
  const [cursorPosY, setCursorPosY] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    setCursorPosX(e.clientX);
    setCursorPosY(e.clientY);
  };
  const handleScroll = (e: Event) => {
    setCursorPosY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Cursor following mask */}
      <motion.div
        className={commonClass}
        style={{ ...commonStyle, WebkitMaskSize: maskSize }}
        animate={{
          WebkitMaskPosition: `${cursorPosX - maskSize / 2}px ${cursorPosY - maskSize / 2}px`,
        }}
        transition={{
          type: "tween",
          ease: "backOut",
        }}
      />
      {/* Fixed mask */}
      <motion.div
        className={commonClass}
        style={{
          ...commonStyle,
          WebkitMaskSize: 800,
          WebkitMaskPosition: "50% 50%",
        }}
      />
    </>
  );
}
