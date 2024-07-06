"use client"

import { EditorContent, Editor } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'

import { ScrollArea } from "@radix-ui/react-scroll-area"

import Header from "./components/Header"
import Options from "./components/Options"
import Tabs from "./components/Tabs"

export default function Dashboard() {
  const editor = useEditor({
    extensions: [StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight
    ],
    editorProps: {
      attributes: {
        class: "h-full bg-white rounded-md resize-none border p-8 shadow-none focus-visible:outline-none"
      }
    },
    content: '<p>Hello World! 🌎️</p>',
  })

  return (
    <div className="h-screen overflow-hidden w-full ">
      <Header />
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
