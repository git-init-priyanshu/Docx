'use client'
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();
  return (
    <MoveLeft
      color="#0F172A"
      size={20}
      className="hover:scale-110 transition-all cursor-pointer"
      onClick={() => router.push("/document")}
    />
  )
}
