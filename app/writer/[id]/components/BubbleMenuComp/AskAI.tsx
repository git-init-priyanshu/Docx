import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { Sparkles } from "lucide-react";

export default function AskAI() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer rounded gap-1 p-2 w-fit items-center hover:bg-slate-100">
          <Sparkles size={20} />
          Ask AI
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        asdf
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
