import { Cloud, Users, Wand } from "lucide-react";
import * as motion from "framer-motion/client";
import AiAnimation from "@/components/aiAnimation";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI powered",
      description:
        "Leverage advanced AI capabilities, offering intelligent assistance and seamless automation without additional costs",
      animation: <Wand />,
    },
    {
      title: "Real-Time Collaboration ",
      description:
        "Multiple users can edit the same document simultaneously, with changes syncing in real-time.",
      animation: <Users />,
    },
    {
      title: "Highly scalable",
      description:
        "Adapts effortlessly to growth, maintaining performance as needs expand.",
      animation: <Cloud />,
    },
  ];

  return (
    <section
      id="features"
      className="relative w-full border-t bg-white z-10 border-b"
    >
      <div className="container px-4 md:px-6 md:mt-20 pb-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={FeaturesVariant}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            <span className="text-black">Key&nbsp;</span>
            <span className="text-blue-500">Features</span>
          </motion.h2>
        </div>
        <div className="flex flex-col gap-10 my-16">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({
  title,
  description,
  animation,
  index,
}: {
  title: string;
  description: string;
  animation: React.ReactNode;
  index: number;
}) {
  const featureSize = "h-60 w-96";

  return (
    <div
      className={`${index % 2 === 0 ? "flex" : "flex flex-row-reverse"} w-full justify-center gap-10`}
    >
      <motion.div
        // initial={`${index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}`}
        // whileInView="visible"
        // viewport={{ once: true }}
        // variants={FeatureVariant}
        // transition={{
        //   duration: 0.5,
        //   ease: "easeIn",
        // }}
        className={`${featureSize} relative bg-neutral-50 border-blue-100 flex justify-center items-center border rounded-md overflow-hidden`}
      >
        {animation}

        {/* <div */}
        {/*   className="absolute w-[120%] h-[120%] bottom-0" */}
        {/*   style={{ */}
        {/*     background: "radial-gradient(73% 20% at 50% 100%, rgb(0, 102, 255) 10%, rgba(171, 171, 171, 0) 100%)", */}
        {/*     filter: "blur(40px)" */}
        {/*   }} */}
        {/* ></div> */}

        {/* <div */}
        {/*   className="absolute w-[120%] h-[120%] bottom-0" */}
        {/*   style={{ */}
        {/*     background: "radial-gradient(100% 100% at 50% 50%, rgb(255 255 255 / 0%) 45%, rgb(59 130 246 / 82%) 115%)", */}
        {/*     filter: "blur(40px)" */}
        {/*   }} */}
        {/* ></div> */}
      </motion.div>

      <motion.div
        // initial={`${index % 2 !== 0 ? "hiddenLeft" : "hiddenRight"}`}
        // whileInView="visible"
        // variants={FeatureVariant}
        // viewport={{ once: true }}
        // transition={{
        //   duration: 0.5,
        //   ease: "easeIn",
        // }}
        className={`${featureSize} flex flex-col justify-center items-center gap-8 p-4`}
      >
        <h3 className="text-3xl text-center">{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </motion.div>
    </div>
  );
}

const FeaturesVariant = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const FeatureVariant = {
  hiddenLeft: {
    x: "-100%",
    opacity: 0,
  },
  hiddenRight: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: "0%",
    opacity: 1,
  },
};
