"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useInView, useReducedMotion } from "framer-motion";

type FeatureVideoProps = {
  clip: string;
  title: string;
};

export default function FeatureVideo({ clip, title }: FeatureVideoProps) {
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(frameRef, { amount: 0.4 });
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView && !shouldReduceMotion) {
      // play() rejects with AbortError when a pause interrupts it; the next view retries.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, shouldReduceMotion, theme]);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] border lp-doc-shadow"
      style={{ borderColor: "var(--lp-border)", background: "var(--lp-paper-2)" }}
    >
      <Image
        src={`/features/${clip}-light.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 620px, 100vw"
        className="object-cover scale-[1.15] dark:hidden"
      />
      <Image
        src={`/features/${clip}-dark.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 620px, 100vw"
        className="object-cover scale-[1.15] hidden dark:block"
      />
      {resolvedTheme && (
        <video
          key={theme}
          ref={videoRef}
          src={`/features/${clip}-${theme}.mp4`}
          poster={`/features/${clip}-${theme}.jpg`}
          aria-label={title}
          className="absolute inset-0 h-full w-full object-cover scale-[1.15]"
          muted
          loop
          playsInline
          preload="none"
        />
      )}
    </div>
  );
}
