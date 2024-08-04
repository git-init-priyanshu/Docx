import { useEditor } from "@tiptap/react"

import { extensions, props } from './editorConfig'

type EditorType = {
  docData?: string,
  debouncedSaveDoc: (editor: any) => void
}

export const Editor = ({ docData, debouncedSaveDoc }: EditorType) => {
  return useEditor({
    extensions: extensions,
    editorProps: props,
    content: docData,
    onUpdate({ editor }) {
      debouncedSaveDoc(editor);
    },
  });
};
