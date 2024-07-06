"use client"

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
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input"

import { Editor } from "@tiptap/react";

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

  if (!editor) return <></>;
  return (
    <div className="hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Edit
          </legend>
          <div className="grid gap-3">
            <Label htmlFor="model">Style</Label>
            <Select>
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
          </div>
          <div className="grid gap-3">
            <Label htmlFor="Font">Font</Label>
            <Select>
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
                      ? 'bg-black text-white rounded hover:bg-black'
                      : ''} bg-white p-2 hover:bg-neutral-100 ${i === formattingBtns.length - 1
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
                    ? 'bg-black text-white rounded hover:bg-black'
                    : ''} bg-white p-2 hover:bg-neutral-100 ${i === paragraphBtns.length - 1
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
