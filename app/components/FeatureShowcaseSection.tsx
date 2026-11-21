"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import FeatureVideo from "./FeatureVideo";

const FEATURES = [
  {
    clip: "editor-blocks",
    title: "Blocks that behave",
    body: "Type / to drop in a heading, table or image. Drag any block by its handle, resize table columns, and press + to add a block below.",
    hint: "/",
  },
  {
    clip: "collaboration",
    title: "Write together, live",
    body: "Every cursor shows up as people type, synced over Yjs in a room scoped to the one document. Turn on link access and anyone with the URL joins in.",
    hint: "Share",
  },
  {
    clip: "ai-assistant",
    title: "AI that edits, and answers",
    body: "Select text and press ⌘K to improve, fix, translate or change tone in place. Press ⌘J to ask across your documents and get answers that cite their sources.",
    hint: "⌘K · ⌘J",
  },
  {
    clip: "version-history",
    title: "Every version, one click back",
    body: "Snapshots are captured as you write. Preview any of them and restore it in one click, even in guest mode.",
    hint: "History",
  },
  {
    clip: "import-export",
    title: "Bring docs in, take them out",
    body: "Import a Google Doc with its images re-hosted, and export your work as Markdown or plain text whenever you like.",
    hint: ".md · .txt",
  },
];

export default function FeatureShowcaseSection() {
  const stepsRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveIndex(
      Math.min(FEATURES.length - 1, Math.floor(progress * FEATURES.length)),
    );
  });

  const activeFeature = FEATURES[activeIndex];

  return (
    <section
      id="features"
      className="py-20 lg:py-28"
      style={{ background: "var(--lp-paper)" }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 lg:px-8">
        <div className="max-w-[640px] mb-12 lg:mb-4">
          <div
            className="font-mono text-[11px] uppercase tracking-wider mb-2"
            style={{ color: "var(--lp-muted)" }}
          >
            Features
          </div>
          <h2
            className="text-[38px] sm:text-[46px] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ color: "var(--lp-ink)" }}
          >
            See it before you sign up.
          </h2>
          <p
            className="mt-4 text-[15px] leading-relaxed"
            style={{ color: "var(--lp-muted)" }}
          >
            Every clip below is the real workflow, start to finish.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr),minmax(0,7fr)] gap-10 lg:gap-16">
          <div className="relative">
            <div
              className="hidden lg:block absolute left-0 inset-y-0 w-px"
              style={{ background: "var(--lp-border)" }}
            >
              <motion.div
                className="w-px h-full origin-top"
                style={{
                  background: "var(--lp-accent)",
                  scaleY: scrollYProgress,
                }}
              />
            </div>

            <ol ref={stepsRef} className="flex flex-col gap-14 lg:gap-0">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.clip}
                className="lg:min-h-[70vh] lg:flex lg:flex-col lg:justify-center lg:pl-8"
              >
                <div
                  className={`transition-opacity duration-300 ${index === activeIndex ? "" : "lg:opacity-40"}`}
                >
                  <div
                    className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider mb-3"
                    style={{ color: "var(--lp-muted)" }}
                  >
                    <span style={{ color: "var(--lp-accent)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded border normal-case"
                      style={{ borderColor: "var(--lp-border)" }}
                    >
                      {feature.hint}
                    </span>
                  </div>
                  <h3
                    className="text-[26px] sm:text-[30px] leading-tight tracking-[-0.02em] font-semibold"
                    style={{ color: "var(--lp-ink)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-relaxed max-w-[440px]"
                    style={{ color: "var(--lp-muted)" }}
                  >
                    {feature.body}
                  </p>
                </div>
                <div className="mt-6 lg:hidden">
                  <FeatureVideo clip={feature.clip} title={feature.title} />
                </div>
              </li>
            ))}
            </ol>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-200px)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeFeature.clip}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FeatureVideo
                    clip={activeFeature.clip}
                    title={activeFeature.title}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex justify-center gap-2">
                {FEATURES.map((feature, index) => (
                  <span
                    key={feature.clip}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: index === activeIndex ? 28 : 6,
                      background:
                        index === activeIndex
                          ? "var(--lp-accent)"
                          : "var(--lp-border)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
