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
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"

export default function Options({ editor }: { editor: Editor | null }) {
  const formattingBtns = [
    { Icon: Bold, name: "bold", func: "toggleBold" },
    { Icon: Italic, name: "italic", func: "toggleItalic" },
    { Icon: Strikethrough, name: "strike", func: "toggleStrike" },
  ]
  const paragraphBtns = [
    { Icon: AlignLeft, align: "left" },
    { Icon: AlignCenter, align: "center" },
    { Icon: AlignRight, align: "right" },
    { Icon: AlignJustify, align: "justify" },
  ]

  const setDefaultStyleValue = () => {
    let level: string = "normal";
    for (let i = 1; i <= 6; i++) {
      if(editor?.isActive('heading', {level: i})) return level = `heading,${String(i)}`;
    }
    return level;
  }
  const onFontStyleChange = (e: string) => {
    if (!editor) return;
    const matcher = e.split(",")
    if (matcher[0] === "normal") return editor.commands.setParagraph();
    // @ts-ignore
    return editor.chain().focus().setHeading({ level: Number(matcher[1]) }).run()
  }

  if (!editor) return <></>;
  return (
    <div className="hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Edit
          </legend>
          <div className="grid gap-3">
            <Label htmlFor="Style">Style</Label>
            <Select value={setDefaultStyleValue()} onValueChange={onFontStyleChange}>
              <SelectTrigger
                id="model"
                className="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="heading,1">Heading 1</SelectItem>
                <SelectItem value="heading,2">Heading 2</SelectItem>
                <SelectItem value="heading,3">Heading 3</SelectItem>
                <SelectItem value="heading,4">Heading 4</SelectItem>
                <SelectItem value="heading,5">Heading 5</SelectItem>
                <SelectItem value="heading,6">Heading 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="Font">Font</Label>
            <Select defaultValue="normal" onValueChange={(e) => console.log(e)}>
              <SelectTrigger
                id="model"
                className="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Normal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="highlight">Highlight</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex cursor-pointer border rounded w-fit">
              {formattingBtns.map(({ func, name, Icon }, i) => {
                return (
                  <Icon
                    key={name}
                    size={35}
                    // @ts-ignore
                    onClick={() => editor.chain().focus()[func]().run()}
                    className={`${editor.isActive(name)
                      ? 'bg-blue-500 text-white hover:bg-blue-500'
                      : 'hover:bg-slate-100 bg-white'} p-2 rounded ${i === formattingBtns.length - 1
                        ? "border-none"
                        : "border-r"}`}
                  />
                )
              })}
            </div>
          </div>
          <Label htmlFor="Paragraph">Paragraph</Label>
          <div className="flex cursor-pointer border rounded w-fit">
            {paragraphBtns.map(({ align, Icon }, i) => {
              return (
                <Icon
                  key={align}
                  size={35}
                  onClick={() => editor.chain().focus().setTextAlign(align).run()}
                  className={`${editor.isActive({ textAlign: align })
                    ? 'bg-blue-500 text-white hover:bg-blue-500'
                    : 'hover:bg-slate-100 bg-white'} p-2 rounded ${i === paragraphBtns.length - 1
                      ? "border-none"
                      : "border-r"}`}
                />
              )
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="top-p">Top P</Label>
              <Input id="top-p" type="number" placeholder="0.7" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="top-k">Top K</Label>
              <Input id="top-k" type="number" placeholder="0.0" />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid bg-white gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Messages
          </legend>
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="system">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
