"use client"

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef
} from 'react'
import { useParams } from 'next/navigation'
import { EditorContent } from '@tiptap/react'
import { useEditor } from "@tiptap/react"
import { debounce } from 'lodash'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

import { ScrollArea } from "@/components/ui/scroll-area"
import { getRandomColor } from '@/helpers/getRandomColor'
import type { Document } from "@prisma/client"
import useClientSession from '@/lib/customHooks/useClientSession'

import {
  ydoc,
  provider,
  extensions,
  props
} from './editor/editorConfig'
import { FormatOptions, InsertOptions } from "./components/options"
import { GetDocDetails, UpdateDocData, UpdateThumbnail } from './actions'
import Header from "./components/Header/Header"
import Tabs from "./components/Tabs"
import Loading from './components/EditorLoading'

export default function Dashboard() {
  const params = useParams()

  const session = useClientSession();

  const [option, setOption] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [docData, setDocData] = useState<Document | undefined>(undefined);
  const [status, setStatus] = useState('connecting')
  console.log(status);

  const editorRef = useRef<HTMLDivElement>(null);

  // console.log(docData);
  useEffect(() => {
    (async () => {
      const response = await GetDocDetails(params.id);
      if (response.success) {
        setDocData(response.data);
      } else {
        toast.error(response.error);
      }
    })();
  }, [])

  const createDocThumbnail = async () => {
    try {
      const page = document.getElementsByClassName("tiptap")[0];
      if (!page) return setIsSaving(false);
      // @ts-ignore
      const canvas = await html2canvas(page, { scale: 1 })

      const thumbnail = canvas.toDataURL(`${docData?.id}thumbnail/png`).replace(/^data:image\/\w+;base64,/, '');

      const formData = new FormData();
      formData.append('image', thumbnail);

      const upload = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData
        })
      const res = await upload.json();
      if (!res.success) {
        setIsSaving(false);
        return toast.error("Couldn't save thumbnail")
      }

      const url = res.data.display_url;
      const deleteUrl = res.data.delete_url;

      await UpdateThumbnail(params.id, url, deleteUrl)

      setIsSaving(false);
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
      setIsSaving(false);
    }
  }

  const saveDoc = useCallback(async (editor: any) => {
    setIsSaving(true);

    const response = await UpdateDocData(params.id, JSON.stringify(editor.getJSON()));
    if (response.success) {
      return createDocThumbnail();
    }
    setIsSaving(false);
    toast.error(response.error);
  }, [session]);

  const debouncedSaveDoc = useMemo(
    () => debounce((editor: any) => saveDoc(editor), 1000),
    [saveDoc, session]
  );

  const editor = useEditor({
    onCreate: ({ editor: currentEditor }) => {
      provider.on('synced', () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent("")
        }
      })
    },
    extensions: [
      ...extensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: localStorage.getItem('name'),
          color: getRandomColor()
        }
      }),
    ],
    editorProps: props,
    content: "",
    onUpdate({ editor }) {
      debouncedSaveDoc(editor);
    },
  });

  useEffect(() => {
    // Update status changes
    const statusHandler = (event: any) => {
      setStatus(event.status)
    }

    provider.on('status', statusHandler)

    return () => {
      provider.off('status', statusHandler)
    }
  }, [provider])

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor) {
      editor.chain().focus().updateUser({ name: localStorage.getItem('name') }).run()
    }
  }, [editor])

  // Set content of the doc
  useEffect(() => {
    if (editor && docData) {
      editor.commands.setContent(
        docData?.data
          ? JSON.parse(docData?.data)
          : ""
      );
    }
  }, [editor, docData, docData?.data]);

  const Options = [
    <FormatOptions key={1} editor={editor} />,
    <InsertOptions key={2} editor={editor} />
  ]

  return (
    <div className="h-screen overflow-y-hidden w-full">
      <Header
        editor={editor}
        name={docData?.name || ""}
        isSaving={isSaving}
      />
      <div className="flex h-full">
        <Tabs option={option} setOption={setOption} />
        <div className="w-full flex gap-4 p-4">
          {Options[option]}
          <ScrollArea className="w-full mb-4 flex justify-center">
            {!docData ? <Loading /> :
              <EditorContent editor={editor} ref={editorRef} />
            }
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
