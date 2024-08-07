"use client"

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import { debounce } from 'lodash'
import html2canvas from 'html2canvas'

import { ScrollArea } from "@/components/ui/scroll-area"

import { FormatOptions, InsertOptions } from "./components/options"
import Header from "./components/Header"
import Tabs from "./components/Tabs"
import Loading from './components/EditorLoading'

import { extensions, props } from './editor/editorConfig'
import { GetDocDetails, UpdateDocData, UpdateThumbnail } from './actions'
import { toast } from 'sonner'
import useClientSession from '@/lib/customHooks/useClientSession'

export default function Dashboard() {
  const params = useParams()

  const session = useClientSession();

  const [isSaving, setIsSaving] = useState(false);
  const [docData, setDocData] = useState<string | JSX.Element | JSX.Element[] | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ["doc-details", params.id],
    queryFn: async () => {
      const response = await GetDocDetails(params.id, session.id!);
      if (response.success) {
        if (response.data?.data) {
          setDocData(JSON.parse(response.data?.data));
        }
        return response.data;
      } else {
        return null;
      }
    },
    retry: 5,
    retryDelay: 100,
  })

  const createDocThumbnail = async () => {
    try {
      const page = document.getElementsByClassName("tiptap")[0];
      if (!page) return;

      // @ts-ignore
      const canvas = await html2canvas(page, { scale: 1 })

      const thumbnail = canvas.toDataURL(`${data?.id}thumbnail/png`).replace(/^data:image\/\w+;base64,/, '');

      const formData = new FormData();
      formData.append('image', thumbnail);

      const upload = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData
        })
      const res = await upload.json();
      const url = res.data.display_url;

      if (!session?.id) return;
      await UpdateThumbnail(params.id, session.id, url)

      setIsSaving(false);
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
      setIsSaving(false);
    }
  }

  const saveDoc = useCallback((editor: any) => {
    setIsSaving(true);
    if (!session?.id) return;

    UpdateDocData(params.id, session.id, JSON.stringify(editor.getJSON()));
    createDocThumbnail();
  }, [session]);

  const debouncedSaveDoc = useMemo(
    () => debounce((editor: any) => saveDoc(editor), 1000),
    [saveDoc, session]
  );

  const editor = useEditor({
    extensions: extensions,
    editorProps: props,
    content: "",
    onUpdate({ editor }) {
      debouncedSaveDoc(editor);
    },
  });

  useEffect(() => {
    console.log(docData);
    if (editor && docData) {
      editor.commands.setContent(docData);
    }
  }, [docData, editor]);

  const Options = [<FormatOptions key={1} editor={editor} />, <InsertOptions key={2} editor={editor} />]
  const [option, setOption] = useState(0)

  return (
    <div className="h-screen overflow-hidden w-full">
      <Header editor={editor} name={data?.name || ""} isSaving={isSaving} />
      <div className="flex h-full">
        <Tabs option={option} setOption={setOption} />
        <div className="flex gap-4 p-4">
          {Options[option]}
          <ScrollArea className="w-full mb-4">
            {!data ? <Loading /> :
              <EditorContent editor={editor} />
            }
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
