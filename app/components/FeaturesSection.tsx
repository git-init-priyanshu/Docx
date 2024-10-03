import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  BadgeIndianRupee,
  Cloud,
  Github,
  LogIn,
  SquarePen,
  Users,
  Zap
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Open source",
      description:
        "Our product is open source, ensuring transparency and prioritizing customer satisfaction.",
      icon: <Github />,
    },
    {
      title: "Free to use",
      description: "Available at no cost, providing full access without any hidden fees or charges.",
      icon: <BadgeIndianRupee />,
    },
    {
      title: "Ease of use",
      description:
        "Simple and intuitive design that makes it effortless to navigate and use, even for beginners.",
      icon: <SquarePen />,
    },
    {
      title: "Real-Time Collaboration ",
      description:
        "Multiple users can edit the same document simultaneously, with changes syncing in real-time.",
      icon: <Users />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <BadgeCheck />,
    },
    {
      title: "Easy onboarding",
      description: "A streamlined and hassle-free setup process that gets you started quickly and smoothly.",
      icon: <LogIn />,
    },
    {
      title: "Lightning fast delivery",
      description: "We deliver new features very rapidly",
      icon: <Zap />,
    },
    {
      title: "Highly scalable",
      description: "Adapts effortlessly to growth, maintaining performance as needs expand.",
      icon: <Cloud />,
    },
  ];
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 border-t bg-slate-50">
      <div className="container mt-52 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              <span className="text-black">Key&nbsp;</span>
              <span className="text-blue-500">Features</span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              DocX empowers teams to work together seamlessly, with real-time editing, version control, and
              intuitive commenting tools.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-blue-50 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-blue-50 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-blue-500 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
