import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  setDefaultStyleValue,
  onFontStyleChange,
  setDefaultFontFamily,
  onFontFamilyChange,
} from "./options/format/functions";
import {
  formattingBtns,
  paragraphBtns,
  fontFamily,
} from "./options/format/textEditorOptions";
import ColorHighlight from "./options/format/ColorHighlight";

type DrawerRespPropType = {
  editor: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function OptionsResp({
  editor,
  isOpen,
  setIsOpen,
}: DrawerRespPropType) {
  return (
    <>
      <div
        className={`${isOpen ? "flex-col" : "hidden"} absolute z-10 bg-red-300 w-fit items-start gap-8`}
        x-chunk="dashboard-03-chunk-0"
      >
        <form className="grid w-full items-start gap-6">
          <fieldset className=" grid gap-6 bg-white rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Style</legend>
            <div className="grid gap-3">
              <Select
                value={setDefaultStyleValue(editor)}
                onValueChange={(value) => onFontStyleChange(editor, value)}
              >
                <SelectTrigger
                  id="model"
                  className="items-start [&_[data-description]]:hidden"
                >
                  <SelectValue placeholder="Normal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="heading 1">Heading 1</SelectItem>
                  <SelectItem value="heading 2">Heading 2</SelectItem>
                  <SelectItem value="heading 3">Heading 3</SelectItem>
                  <SelectItem value="heading 4">Heading 4</SelectItem>
                  <SelectItem value="heading 5">Heading 5</SelectItem>
                  <SelectItem value="heading 6">Heading 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          <fieldset className="grid max-w-fit gap-6 bg-white rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Font</legend>
            <div className="">
              <Select
                defaultValue={setDefaultFontFamily(editor)}
                onValueChange={(value) => onFontFamilyChange(editor, value)}
              >
                <SelectTrigger
                  id="model"
                  className="items-start [&_[data-description]]:hidden col-span-3"
                >
                  <SelectValue placeholder="Inter" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamily.map((item) => {
                    return (
                      <SelectItem key={item.title} value={item.font}>
                        {item.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div className="w-full mt-3 flex justify-between gap-4">
                <div className="flex cursor-pointer border rounded w-fit col-span-3">
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
                          i === formattingBtns.length - 1
                            ? "border-none"
                            : "border-r"
                        }`}
                      />
                    );
                  })}
                </div>
                <ColorHighlight editor={editor} />
              </div>
            </div>
          </fieldset>
          <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Paragraph
            </legend>
            <div className="grid gap-3">
              <div className="flex cursor-pointer border rounded w-fit">
                {paragraphBtns.map(({ align, Icon }, i) => {
                  return (
                    <Icon
                      key={align}
                      size={35}
                      onClick={() =>
                        editor?.chain().focus().setTextAlign(align).run()
                      }
                      className={`${
                        editor?.isActive({ textAlign: align })
                          ? "bg-blue-500 text-white hover:bg-blue-500"
                          : "hover:bg-slate-100 bg-white"
                      } p-2 rounded ${
                        i === paragraphBtns.length - 1
                          ? "border-none"
                          : "border-r"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
}
