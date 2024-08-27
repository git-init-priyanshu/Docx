import { paragraphBtns } from "./textEditorOptions";

export default function ParagraphBtns({ editor }: any) {
  return (
    <div className="flex cursor-pointer border rounded w-fit col-span-6 sm:col-span-4">
      {paragraphBtns.map(({ align, Icon }, i) => {
        return (
          <Icon
            key={align}
            size={35}
            onClick={() => editor?.chain().focus().setTextAlign(align).run()}
            className={`${
              editor?.isActive({ textAlign: align })
                ? "bg-blue-500 text-white hover:bg-blue-500"
                : "hover:bg-slate-100 bg-white"
            } p-2 rounded ${
              i === paragraphBtns.length - 1 ? "border-none" : "border-r"
            }`}
          />
        );
      })}
    </div>
  );
}
