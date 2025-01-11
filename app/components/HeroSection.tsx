import Link from "next/link";
import * as motion from "framer-motion/client";

import GridBg from "@/components/GridBg";
import Navbar from "@/components/Navbar";
import LoopWords from "@/components/LoopWords";
import HeroImage from "@/components/HeroImage";

export default function HeroSection() {
  return (
    <>
      <Navbar />

      <section className="flex items-center h-screen w-full bg-background border-b overflow-hidden">
        <GridBg
          isCursorMaskEnabled={true}
          cursorMaskSize={300}
          bgMaskSize={800}
          bgMaskPos={[50, 50 ]}
          blurValue={1}
          opacity={0.3}
        />
        <div className="flex items-center justify-center text-center w-full px-4 md:mt-40 md:px-6 lg:mt-0 ">
          <div className="relative flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                variants={HeroVariant}
                initial="hidden"
                animate="visible"
                transition={{
                  opacity: { duration: 0.2 },
                  y: { duration: 1 },
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
                  y: { duration: 1 },
                }}
                className="max-w-[650px] text-muted-foreground md:text-xl"
              >
                DocX is an open-source AI powered alternative to Google Docs
                that empowers teams to create, edit, and collaborate seamlessly.
              </motion.p>
            </div>
            <motion.div
              variants={HeroVariant}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 1,
                opacity: { duration: 0.2 },
                y: { duration: 1 },
              }}
              className="flex justify-center flex-col gap-8 min-[400px]:flex-row"
            >
              <Link
                href="/document"
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
      </section>

      <HeroImage />
    </>
  );
}

const HeroVariant = {
  hidden: {
    y: 10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};
