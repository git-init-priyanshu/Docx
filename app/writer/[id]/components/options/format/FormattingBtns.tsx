import { formattingBtns } from "./textEditorOptions";

export default function FormattingBtns({ editor }: any) {
  return (
    <div className="flex cursor-pointer border rounded w-fit col-span-6 sm:col-span-4 lg:col-span-3 lg:mb-0">
      {formattingBtns.map(({ func, name, Icon }, i) => {
        return (
          <Icon
            key={name}
            size={35}
            // @ts-ignore
            onClick={() => editor?.chain().focus()[func]().run()}
            className={`${
              editor?.isActive(name)
                ? "bg-blue-500 text-white hover:bg-blue-500"
                : "hover:bg-slate-100 bg-white"
            } p-2 rounded ${
              i === formattingBtns.length - 1 ? "border-none" : "border-r"
            }`}
          />
        );
      })}
    </div>
  );
}
