"use client"

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import { debounce } from 'lodash'
import html2canvas from 'html2canvas'

import { ScrollArea } from "@/components/ui/scroll-area"

import { FormatOptions, InsertOptions } from "./components/options"
import Header from "./components/Header"
import Tabs from "./components/Tabs"
import Loading from './components/EditorLoading'

import { extensions, props } from './editorConfig'
import { GetDocDetails, UpdateDocData, UpdateThumbnail } from './actions'

export default function Dashboard() {
  const params = useParams()

  const [content, setContent] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["doc-details"],
    queryFn: async () => {
      const response = await GetDocDetails(params.id);
      if (response.success) {
        return response.data;
      } else {
        return null;
      }
    },
    enabled: false
  })
  const { data: url, mutate } = useMutation({
    mutationKey: ["upload-thumbnail"],
    mutationFn: async (body: FormData) => {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body
        })
      const url = await response.json();
      return url.data.display_url;
    }
  })

  useEffect(() => {
    if (!data) return;
    setContent(data?.data)
  }, [data])

  const createDocThumbnail = async () => {
    const page = document.getElementsByClassName("tiptap")[0];
    if (!page) return;

    // @ts-ignore
    const canvas = await html2canvas(page, { scale: 0.5 })

    const thumbnail = canvas.toDataURL(`${data?.id}thumbnail/png`).replace(/^data:image\/\w+;base64,/, '');

    const formData = new FormData();
    formData.append('image', thumbnail);

    mutate(formData);
    await UpdateThumbnail(params.id, url)
  }

  const saveDoc = useCallback((editor: any) => {
    UpdateDocData(params.id, JSON.stringify(editor.getJSON()));
    createDocThumbnail();
  }, []);

  const debouncedSaveDoc = useMemo(
    () => debounce((editor: any) => saveDoc(editor), 1000),
    [saveDoc]
  );

  console.log(content);
  const editor = useEditor({
    extensions: extensions,
    editorProps: props,
    content: content,
    onBeforeCreate: () => {
      refetch();
    },
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
