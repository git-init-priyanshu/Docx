"use client"

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ColorHighlight from "./ColorHighlight";

const formattingBtns = [
  { Icon: Bold, name: "bold", func: "toggleBold" },
  { Icon: Italic, name: "italic", func: "toggleItalic" },
  { Icon: Underline, name: "underline", func: "toggleUnderline" },
  { Icon: Strikethrough, name: "strike", func: "toggleStrike" },
]
const paragraphBtns = [
  { Icon: AlignLeft, align: "left" },
  { Icon: AlignCenter, align: "center" },
  { Icon: AlignRight, align: "right" },
  { Icon: AlignJustify, align: "justify" },
]

const fontFamily = [
  { title: "Inter", font: "Inter" },
  { title: "Comic Sans", font: "Comic Sans MS, Comic Sans" },
  { title: "Serif", font: "serif" },
  { title: "Monospace", font: "monospace" },
  { title: "Cursive", font: "cursive" },
]
export default function FormatOptions({ editor }: { editor: Editor | null }) {
  const setDefaultStyleValue = () => {
    let level: string = "normal";
    for (let i = 1; i <= 6; i++) {
      if (editor?.isActive('heading', { level: i })) return level = `heading ${String(i)}`;
    }
    return level;
  }
  const onFontStyleChange = (val: string) => {
    const matcher = val.split(" ")
    if (matcher[0] === "normal") return editor?.commands.setParagraph();
    // @ts-ignore
    return editor?.chain().focus().setHeading({ level: Number(matcher[1]) }).run();
  }

  const setDefaultFontFamily = () => {
    const matcher = fontFamily.find((item) => {
      return editor?.isActive('textStyle', { fontFamily: item.font });
    })
    return matcher?.font || "Inter";
  }
  const onFontFamilyChange = (font: string) => {
    return editor?.chain().focus().setFontFamily(font).run()
  }

  return (
    <div className="w-fit hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Style
          </legend>
          <div className="grid gap-3">
            <Select value={setDefaultStyleValue()} onValueChange={onFontStyleChange}>
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

        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Font
          </legend>
          <div className="grid gap-3 grid-cols-3">
            <Select defaultValue={setDefaultFontFamily()} onValueChange={onFontFamilyChange}>
              <SelectTrigger
                id="model"
                className="items-start [&_[data-description]]:hidden col-span-3"
              >
                <SelectValue placeholder="Inter" />
              </SelectTrigger>
              <SelectContent>
                {fontFamily.map((item) => {
                  return <SelectItem key={item.title} value={item.font}>{item.title}</SelectItem>
                })}
              </SelectContent>
            </Select>

            <div className="flex gap-4">            
              <div className="flex cursor-pointer border rounded w-fit col-span-3">
              {formattingBtns.map(({ func, name, Icon }, i) => {
                return (
                  <Icon
                    key={name}
                    size={35}
                    // @ts-ignore
                    onClick={() => editor?.chain().focus()[func]().run()}
                    className={`${editor?.isActive(name)
                      ? 'bg-blue-500 text-white hover:bg-blue-500'
                      : 'hover:bg-slate-100 bg-white'} p-2 rounded ${i === formattingBtns.length - 1
                        ? "border-none"
                        : "border-r"}`}
                  />
                )
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
                    onClick={() => editor?.chain().focus().setTextAlign(align).run()}
                    className={`${editor?.isActive({ textAlign: align })
                      ? 'bg-blue-500 text-white hover:bg-blue-500'
                      : 'hover:bg-slate-100 bg-white'} p-2 rounded ${i === paragraphBtns.length - 1
                        ? "border-none"
                        : "border-r"}`}
                  />
                )
              })}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
