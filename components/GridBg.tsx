"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type GridBgPropType = {
  customClass?: string,
  isCursorMaskEnabled: boolean,
  cursorMaskSize: number;
  bgMaskSize: number;
  bgMaskPos: [number, number]
  blurValue: number;
  opacity: number;
}
export default function GridBg({
  customClass = "",
  isCursorMaskEnabled,
  cursorMaskSize,
  bgMaskSize,
  bgMaskPos,
  blurValue,
  opacity
}: GridBgPropType) {
  const commonClass = "absolute w-full h-full";
  const commonStyle = {
    background: "url('/grid_bg.svg')",
    backgroundSize: "200px",
    WebkitMaskImage: "url('/mask.svg')",
    WebkitMaskRepeat: "no-repeat",
    filter: `blur(${blurValue}px)`,
  };

  const [cursorPosX, setCursorPosX] = useState(0);
  const [cursorPosY, setCursorPosY] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    setCursorPosX(e.clientX);
    setCursorPosY(e.pageY);
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Cursor following mask */}
      {isCursorMaskEnabled &&
        <motion.div
          className={commonClass + " " + customClass}
          initial={{ opacity: 0 }}
          animate={{
            opacity,
            WebkitMaskPosition: `${cursorPosX - cursorMaskSize / 2}px ${cursorPosY - cursorMaskSize / 2}px`,
          }}
          transition={{
            type: "tween",
            ease: "backOut",
            opacity: { duration: 0.5 }
          }}
          style={{ ...commonStyle, WebkitMaskSize: cursorMaskSize }}
        />
      }
      {/* Fixed mask */}
      <motion.div
        className={commonClass + " " + customClass}
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{
          opacity: { duration: 0.5 }
        }}
        style={{
          ...commonStyle,
          WebkitMaskSize: bgMaskSize,
          WebkitMaskPosition: `${bgMaskPos[0]}% ${bgMaskPos[1]}%`,
        }}
      />
    </>
  );
}
