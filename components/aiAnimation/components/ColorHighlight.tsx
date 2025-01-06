import { Baseline, ChevronDown, Highlighter } from "lucide-react";

type ColorHighlightPropType = {
  isBubbleMenuBtn: boolean;
};
export default function ColorHighlight({ isBubbleMenuBtn }: ColorHighlightPropType) {
  return (
    <div
      className={`flex items-center cursor-pointer rounded w-fit ${isBubbleMenuBtn ? "gap-1" : "border col-span-6 sm:col-span-4 lg:mb-0"}`}
    >
      <Baseline 
        size={35} 
        className={`p-2 rounded ${isBubbleMenuBtn ? "" : "border-r"}`} 
      />
      <ChevronDown
        size={35}
        strokeWidth={1}
        className={`py-2 w-fit ${isBubbleMenuBtn ? "" : "border-r"}`}
      />
      <Highlighter 
        size={35} 
        color="#fdfb7a"
        className={`py-2 w-fit ${isBubbleMenuBtn ? "" : "border-r"}`}
      />
      <ChevronDown
        size={35}
        strokeWidth={1}
        className={`p-2 rounded ${isBubbleMenuBtn ? "" : "border-r"}`}
      />
    </div>
  )
}
