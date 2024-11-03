"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type LoopWordsPropType = {
  className?: string;
  words: string[];
};

export default function LoopWords({ className, words }: LoopWordsPropType) {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((curr) => (curr + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words]);

  // const letterVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0 },
  //   exit: { opacity: 0, y: -20 }
  // };

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={words[currentWord]}
        className={className}
        initial={{
          y: 50,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        exit={{
          y: -50,
          opacity: 0
        }}
        transition={{ ease: "easeInOut" }}
      >
        {words[currentWord].split("").map((char, i) => {
          return <motion.span
            key={`${char}-${i}`}
            // initial={{
            //   y: 100
            // }}
            // animate={{
            //   y: 0,
            // }}
            // exit={{
            //   y: -100
            // }}
            // transition={{ delay: i * 0.08, ease: "easeInOut" }}
            className="inline-block"
          >
            {char}
          </motion.span>
        })}
      </motion.p>
    </AnimatePresence>
  );
}
