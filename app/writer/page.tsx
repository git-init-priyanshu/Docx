"use client"

import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"

import { ScrollArea } from "@radix-ui/react-scroll-area"

import Header from "./components/Header"
import { FormatOptions, InsertOptions } from "./components/options"
import Tabs from "./components/Tabs"
import { extensions, props } from './editorConfig'
import { useState } from 'react'


export default function Dashboard() {
  const editor = useEditor({
    extensions: extensions,
    editorProps: props,
    content: `
<p><span style="font-family: Inter">Did you know that Inter is a really nice font for interfaces?</span></p>
        <p><span style="font-family: Comic Sans MS, Comic Sans">It doesn’t look as professional as Comic Sans.</span></p>
        <p><span style="font-family: serif">Serious people use serif fonts anyway.</span></p>
        <p><span style="font-family: monospace">The cool kids can apply monospace fonts aswell.</span></p>
        <p><span style="font-family: cursive">But hopefully we all can agree, that cursive fonts are the best.</span></p>
        
      `,
  })

  const Options = [<FormatOptions editor={editor} />, <InsertOptions editor={editor} />]
  const [option, setOption] = useState(0)

  return (
    <div className="h-screen overflow-hidden w-full ">
      <Header editor={editor} />
      <div className="flex h-full">
        <Tabs option={option} setOption={setOption} />
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          {Options[option]}
          <ScrollArea className="col-span-2">
            <EditorContent editor={editor} />
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
