import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Document from '@tiptap/extension-document'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'

import { cn } from '@/lib/utils'

export const extensions = [
  StarterKit,
  Color.configure({ types: [TextStyle.name] }),
  Highlight.configure({ multicolor: true }),
  Document,
  Underline,
  TextStyle,
  FontFamily,
  Heading.configure({
    levels: [1, 2, 3, 4, 5],
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]

export const props = {
  attributes: {
    class: cn("prose [&_ol]:list-decimal [&_ul]:list-disc bg-white rounded-md resize-none border p-8 shadow-none focus-visible:outline-none")
  }
}
