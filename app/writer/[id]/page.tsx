"use client"

import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import { debounce } from 'lodash'

import { ScrollArea } from "@/components/ui/scroll-area"

import { FormatOptions, InsertOptions } from "./components/options"
import Header from "./components/Header"
import Tabs from "./components/Tabs"
import Loading from './components/EditorLoading'

import { extensions, props } from './editorConfig'
import { GetDocDetails, UpdateDocData } from './actions'

export default function Dashboard() {
  const params = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["doc-details"],
    queryFn: async () => {
      const response = await GetDocDetails(params.id);
      if (response.success) {
        return response.data;
      } else {
        return null;
      }
    }
  })

  // const cont = { "type": "doc", "content": [{ "type": "paragraph", "attrs": { "textAlign": "left" }, "content": [{ "type": "text", "text": "This is cont" }] }] }
  const createDocThumbnail = () => {

  }

  const saveDoc = useCallback((editor: any) => {
    UpdateDocData(params.id, JSON.stringify(editor.getJSON()));
    createDocThumbnail();
  }, []);

  const debouncedSaveDoc = useMemo(
    () => debounce((editor: any) => saveDoc(editor), 1000),
    [saveDoc]
  );

  const editor = useEditor({
    extensions: extensions,
    editorProps: props,
    content: data && data.data && JSON.parse(data?.data),
    onUpdate({ editor }) {
      debouncedSaveDoc(editor);
    },
  })

  const Options = [<FormatOptions key={1} editor={editor} />, <InsertOptions key={2} editor={editor} />]
  const [option, setOption] = useState(0)

  return (
    <div className="h-screen overflow-hidden w-full">
      <Header editor={editor} name={data?.name || ""} />
      <div className="flex h-full">
        <Tabs option={option} setOption={setOption} />
        <div className="flex gap-4 p-4">
          {Options[option]}
          <ScrollArea className="w-full mb-4">
            {isLoading ? <Loading /> :
              <EditorContent editor={editor} />
            }
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
