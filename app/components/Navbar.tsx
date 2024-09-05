"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FancyBtn } from "@/components/FancyBtn";

const navItems = [
  {
    name: "Features",
    link: "features"
  },
  {
    name: "About",
    link: "about"
  },
  {
    name: "Contact",
    link: "contact"
  },
  {
    name: "Signin",
    link: "signin"
  }
]
export default function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-10 flex max-w-fit inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-2 md:pl-8 py-1 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem: any, idx: number) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-0 md:space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-black"
          )}
        >
          <span className="block">{navItem.icon}</span>
          <span className="text-sm">{navItem.name}</span>
        </Link>
      ))}
      {/* @ts-ignore */}
      <FancyBtn title="Signup" link="signup" />
    </div>
  );
};
