import { formattingBtns } from "./textEditorOptions";

type FormattingBtnsPropType = {
  editor: any,
  isBubbleMenuBtn: boolean
}
export default function FormattingBtns({ editor, isBubbleMenuBtn }: FormattingBtnsPropType) {
  return (
    <div className={`flex cursor-pointer rounded w-fit ${isBubbleMenuBtn ? "gap-1" : "border col-span-6 sm:col-span-4 lg:col-span-3 lg:mb-0"} `}>
      {formattingBtns.map(({ func, name, Icon }, i) => {
        return (
          <button
            key={name}
            // @ts-ignore
            onClick={() => editor?.chain().focus()[func]().run()}
            className={`${editor?.isActive(name)
              ? "bg-blue-500 text-white hover:bg-blue-500"
              : `hover:bg-slate-100 ${isBubbleMenuBtn ? "bg-neutral-50" : "bg-white"}`
              } p-2 rounded ${!isBubbleMenuBtn && (i === formattingBtns.length - 1 ? "border-none" : "border-r")
              }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
