import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

const formattingBtns = [
  { Icon: Bold, name: "bold", func: "toggleBold" },
  { Icon: Italic, name: "italic", func: "toggleItalic" },
  { Icon: Underline, name: "underline", func: "toggleUnderline" },
  { Icon: Strikethrough, name: "strike", func: "toggleStrike" },
];
type FormattingBtnsPropType = {
  isBubbleMenuBtn: boolean;
};
export default function FormattingBtns({
  isBubbleMenuBtn,
}: FormattingBtnsPropType) {
  return (
    <div
      className={`flex cursor-pointer rounded w-fit ${isBubbleMenuBtn ? "gap-1" : "border col-span-6 sm:col-span-4 lg:col-span-3 lg:mb-0"} `}
    >
      {formattingBtns.map(({ name, Icon }, i) => {
        return (
          <button
            key={name}
            className={`${i === 0 && !isBubbleMenuBtn
              ? "bg-blue-500 text-white "
              : `${isBubbleMenuBtn ? "bg-neutral-50" : "bg-white"}`
              } p-2 rounded ${!isBubbleMenuBtn &&
              (i === formattingBtns.length - 1 ? "border-none" : "border-r")
              }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
