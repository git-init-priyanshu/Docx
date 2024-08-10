'use client'

import { Input } from "@/components/ui/input";
import { CircleCheck } from "lucide-react";

export default function CardInput({ title, value, ...props }: any) {
  console.log(value)
  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
      />
      <CircleCheck
        className={`size-4 text-slate-500 hover:cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2`}>
      </CircleCheck>
    </div>
  )
}
