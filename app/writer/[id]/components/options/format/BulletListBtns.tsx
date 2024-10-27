import { List } from "lucide-react";

import { BulletBtns } from "./textEditorOptions";

export default function BulletListBtns({ editor }: any) {
  return (
    <div className="flex cursor-pointer border rounded w-fit col-span-6 sm:col-span-4">
      {BulletBtns.map(({ Icon, key }, i) => {
        return (
          <Icon
            key={key}
            size={35}
            onClick={() =>
              Icon === List
                ? editor?.chain()?.focus().toggleBulletList().run()
                : editor?.chain().focus().toggleOrderedList().run()
            }
            className={`${
              Icon === List
                ? editor?.isActive("bulletList")
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "hover:bg-slate-100 bg-white"
                : editor?.isActive("orderedList")
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "hover:bg-slate-100 bg-white"
            } p-2 rounded ${
              i === BulletBtns.length - 1 ? "border-none" : "border-r"
            }`}
          />
        );
      })}
    </div>
  );
}
