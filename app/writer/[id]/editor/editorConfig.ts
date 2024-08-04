import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
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
  Underline,
  TextStyle,
  FontFamily,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]

export const props = {
  attributes: {
    class: cn("[&_ol]:list-decimal [&_ul]:list-disc w-[818px] h-[1056px] mx-auto bg-white rounded-md border p-8 shadow-none focus-visible:outline-none")
  }
}
