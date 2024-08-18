import { Color } from '@tiptap/extension-color'
import { WebsocketProvider } from 'y-websocket'
import Collaboration from '@tiptap/extension-collaboration'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import * as Y from 'yjs'

import { cn } from '@/lib/utils'

export const ydoc = new Y.Doc();

const room = `room.${new Date()
  .getFullYear()
  .toString()
  .slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`

export const provider = new WebsocketProvider(
  process.env.NEXT_PUBLIC_SIGNALLING_URL as string,
  room,
  ydoc
);

export const extensions = [
  StarterKit.configure({
    history: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6]
    }
  }),
  Color.configure({ types: [TextStyle.name] }),
  Highlight.configure({ multicolor: true }),
  Underline,
  TextStyle,
  FontFamily,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Collaboration.configure({
    document: ydoc,
  }),
]

export const props = {
  attributes: {
    class: cn("prose [&_ol]:list-decimal [&_ul]:list-disc w-[816.3px] max-w-[816.3px] h-[1056.36px] mx-auto bg-white rounded-md border p-24 my-2 shadow-none focus-visible:outline-none")
  }
}
