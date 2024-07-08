"use client"

import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'

import { ScrollArea } from "@radix-ui/react-scroll-area"

import Header from "./components/Header"
import Options from "./components/Options"
import Tabs from "./components/Tabs"
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Document,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class: cn("prose [&_ol]:list-decimal [&_ul]:list-disc bg-white rounded-md resize-none border p-8 shadow-none focus-visible:outline-none")
      }
    },
    content: `
        <h1>This is a 1st level heading</h1>
        <h2>This is a 2nd level heading</h2>
        <h3>This is a 3rd level heading</h3>
        <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
      `,
  })

  return (
    <div className="h-screen overflow-hidden w-full ">
      <Header editor={editor} />
      <div className="flex h-full">
        <Tabs />
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <Options editor={editor} />
          <ScrollArea className="col-span-2">
            <EditorContent editor={editor} />
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
