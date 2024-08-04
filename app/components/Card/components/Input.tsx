'use client'

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react"

type InputPropType = {
  title: string;
}

export default function CardInput({title}:InputPropType) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(title)

  return (
    <Input
      ref={inputRef}
      value={name}
      className="w-full text-md border-none focus:outline-none"
      onChange={(e) => setName(e.target.value)}
    />
  )
}
