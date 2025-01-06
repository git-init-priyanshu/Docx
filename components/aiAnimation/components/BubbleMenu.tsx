import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Languages,
  Pencil,
  Sparkles,
  Undo2,
  Wand,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ColorHighlight from "./ColorHighlight";
import FormattingBtns from "./FormattingBtns";

const state = {
  opacity: 0.5,
  scale: 0.8,
}
const animation = {
  opacity: 1,
  scale: 0.9,
}
const dropdownOptions = [
  { icon: <Wand size={15} />, text: "Improve writing" },
  { icon: <Check size={15} />, text: "Fix spellings & grammar" },
  { icon: <Languages size={15} />, text: "Translate" },
  {
    icon: <svg
      role="graphics-symbol"
      viewBox="0 0 16 16"
      style={{
        width: "16px",
        height: "16px",
        display: "block",
        fill: "black",
      }}
    >
      <path d="M1.56738 3.25879C1.22559 3.25879 0.952148 2.97852 0.952148 2.63672C0.952148 2.29492 1.21875 2.02148 1.56738 2.02148H14.4258C14.7744 2.02148 15.0479 2.29492 15.0479 2.63672C15.0479 2.97852 14.7676 3.25879 14.4258 3.25879H1.56738ZM1.56738 6.84082C1.22559 6.84082 0.952148 6.56055 0.952148 6.21875C0.952148 5.87695 1.21875 5.60352 1.56738 5.60352H14.4258C14.7744 5.60352 15.0479 5.87695 15.0479 6.21875C15.0479 6.56055 14.7676 6.84082 14.4258 6.84082H1.56738ZM1.56738 10.4229C1.22559 10.4229 0.952148 10.1426 0.952148 9.80078C0.952148 9.45898 1.21875 9.18555 1.56738 9.18555H14.4258C14.7744 9.18555 15.0479 9.45898 15.0479 9.80078C15.0479 10.1426 14.7676 10.4229 14.4258 10.4229H1.56738ZM1.56738 14.0049C1.22559 14.0049 0.952148 13.7246 0.952148 13.3828C0.952148 13.041 1.21875 12.7676 1.56738 12.7676H8.75879C9.10742 12.7676 9.38086 13.041 9.38086 13.3828C9.38086 13.7246 9.10059 14.0049 8.75879 14.0049H1.56738Z"></path>
    </svg>
    , text: "Make longer"
  },
  {
    icon: <svg
      role="graphics-symbol"
      viewBox="0 0 16 16"
      style={{
        width: "16px",
        height: "16px",
        display: "block",
        fill: "black",
      }}
    >
      <path d="M1.55371 6.81055C1.21875 6.81055 0.952148 6.54395 0.952148 6.20898C0.952148 5.87402 1.21875 5.60742 1.55371 5.60742H14.4395C14.7744 5.60742 15.0479 5.87402 15.0479 6.20898C15.0479 6.54395 14.7744 6.81055 14.4395 6.81055H1.55371ZM1.55371 10.3926C1.21875 10.3926 0.952148 10.126 0.952148 9.79102C0.952148 9.45605 1.21875 9.18945 1.55371 9.18945H9.2168C9.55176 9.18945 9.81836 9.45605 9.81836 9.79102C9.81836 10.126 9.55176 10.3926 9.2168 10.3926H1.55371Z"></path>
    </svg>
    , text: "Make shorter"
  },
  { icon: <Pencil size={15} />, text: "Simplify language" }
]

type BebbleMenuPropType = {
  isHovered: boolean;
  setDisplayText: React.Dispatch<React.SetStateAction<string>>;
  setIsHighlightVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function BubbleMenu({
  isHovered,
  setDisplayText,
  setIsHighlightVisible
}: BebbleMenuPropType) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenTxtVisible, setIsGenTxtVisible] = useState(false);

  const clearAllTimeouts = (
    bubbleTimeout: NodeJS.Timeout,
    dropdownTimeout: NodeJS.Timeout,
    removeDropdownTimeout: NodeJS.Timeout,
    removeGeneratingTimeout: NodeJS.Timeout,
    removeGenTxtTimeout: NodeJS.Timeout
  ) => {
    window.clearTimeout(bubbleTimeout)
    window.clearTimeout(dropdownTimeout)
    window.clearTimeout(removeDropdownTimeout)
    window.clearTimeout(removeGeneratingTimeout)
    window.clearTimeout(removeGenTxtTimeout)
  }
  useEffect(() => {
    if (!isHovered) {
      setIsMenuVisible(false);
      setIsDropdownVisible(false);
      setIsGenerating(false);
      setIsGenTxtVisible(false);
      return;
    };
    const bubbleTimeout = setTimeout(() => {
      setIsMenuVisible(true);
    }, 1200)

    const dropdownTimeout = setTimeout(() => {
      setIsDropdownVisible(true);
    }, 5500)

    const removeDropdownTimeout = setTimeout(() => {
      setIsDropdownVisible(false);
      setIsMenuVisible(false);
      setIsGenerating(true);
    }, 7600)

    const removeGeneratingTimeout = setTimeout(() => {
      setIsGenerating(false);
      setIsGenTxtVisible(true);
    }, 9000)

    const removeGenTxtTimeout = setTimeout(() => {
      setIsGenTxtVisible(false);
      setDisplayText("This document highlights the advanced AI capabilities integrated into this project.")
      setIsHighlightVisible(false);
    }, 11900)

    return clearAllTimeouts(
      bubbleTimeout,
      dropdownTimeout,
      removeDropdownTimeout,
      removeGeneratingTimeout,
      removeGenTxtTimeout
    )
  }, [isHovered])
  return (
    <>
      {
        isMenuVisible &&
        <motion.div
          className="absolute min-w-max z-10 flex scale-[0.9] -top-14"
          initial={{
            ...state,
            x: "-80%"
          }}
          animate={{
            ...animation,
            x: "0%"
          }}
          exit={{
            ...state,
            x: "0%"
          }}
          transition={{
            x: { duration: 2 },
            ease: "easeInOut"
          }}
        >
          <div className="flex gap-1 p-2 shadow-md bg-neutral-50 ">
            <div
              className="flex cursor-pointer rounded w-fit gap-1"
            >
              <Button
                variant="ghost"
                className="flex cursor-pointer bg-neutral-50 rounded gap-1 p-2 w-fit items-center"
              >
                <Sparkles size={20} />
                Ask AI
              </Button>
            </div>
            <FormattingBtns isBubbleMenuBtn={true} />
            <ColorHighlight isBubbleMenuBtn={true} />
          </div>
        </motion.div>
      }
      {
        isDropdownVisible &&
        <motion.div
          key="dropdown"
          className="absolute flex flex-col bg-white shadow-md rounded-md w-56 z-10 p-1 scale-[0.9] -top-4 -left-8"
          initial={state}
          animate={animation}
          exit={state}
        >
          <p className="ml-1 font-semibold text-neutral-400 p-1 text-sm">Suggested</p>
          {dropdownOptions.map((option, index) => {
            return (
              <>
                <div
                  key={option.text}
                  className="flex gap-2 rounded-md p-[0.30rem] items-center text-sm"
                >
                  {option.icon}
                  <p>{option.text}</p>
                </div>
                {
                  index === 2 &&
                  <>
                    <ChevronRight size={15} className="absolute top-[6.1rem] right-2" />
                    <div className="w-full h-[2px] bg-slate-100 mt-2"></div>
                    <p className="ml-1 font-semibold text-neutral-400 p-1 text-sm">Edit</p>
                  </>
                }
              </>
            )
          })}
        </motion.div>
      }
      {isGenerating &&
        <motion.div
          key="generating"
          className="absolute flex gap-2 items-center bg-white shadow-md rounded-md w-max z-10 p-2 px-4 scale-[0.9] top-6 left-20"
          initial={state}
          animate={animation}
          exit={state}
        >
          <Sparkles size={20} strokeWidth={1.5} />
          Generating
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            style={{ width: "20px", height: "20px" }}
          >
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="40"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.4"
              ></animate>
            </circle>
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="100"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.2"
              ></animate>
            </circle>
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="160"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="0"
              ></animate>
            </circle>
          </svg>
        </motion.div>
      }
      {
        isGenTxtVisible &&
        <>
          <motion.div
            key="generatedText"
            className="absolute gap-2 items-center bg-white shadow-md rounded-md w-max z-10 p-2 px-4 scale-[0.9] top-6 left-10"
            initial={state}
            animate={animation}
            exit={state}
          >
            <div className=" flex gap-2 mb-2 items-center text-neutral-500">
              <Sparkles size={20} strokeWidth={1.5} />
              Generated text
            </div>
            <p className="text-neutral-800">
              This document demonstrats AI capabilities of this project.
            </p>
          </motion.div>
          <motion.div
            className="absolute gap-2 text-sm items-center bg-white shadow-md rounded-md w-max z-10 p-1 scale-[0.9] top-24 left-[50%]"
            initial={state}
            animate={animation}
            exit={state}
          >
            <div
              className="flex gap-2 rounded-md p-[0.30rem] items-center text-sm"
            >
              <Check size={15} />
              Accept
            </div>
            <div
              className="flex gap-2 rounded-md p-[0.30rem] items-center text-sm"
            >
              <X size={15} />
              Discard
            </div>
            <div
              className="flex gap-2 rounded-md p-[0.30rem] items-center text-sm"
            >
              <Undo2 size={15} />
              Try again
            </div>
          </motion.div>
        </>
      }
    </>
  )
}
