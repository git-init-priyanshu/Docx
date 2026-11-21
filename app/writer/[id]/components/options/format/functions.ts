import type { Editor } from "@tiptap/react";

import { fontFamily } from "./textEditorOptions";

export const setDefaultStyleValue = (editor: Editor | null) => {
  let level: string = "normal";
  for (let i = 1; i <= 6; i++) {
    if (editor?.isActive("heading", { level: i }))
      return (level = `heading ${String(i)}`);
  }
  return level;
};

export const onFontStyleChange = (editor: Editor | null, val: string) => {
  const matcher = val.split(" ");
  if (matcher[0] === "normal") return editor?.commands.setParagraph();
  // @ts-ignore
  return editor?.commands.setHeading({ level: Number(matcher[1]) });
};

export const setDefaultFontFamily = (editor: Editor | null) => {
  const matcher = fontFamily.find((item) => {
    return editor?.isActive("textStyle", { fontFamily: item.font });
  });
  return matcher?.font || "Inter";
};

export const onFontFamilyChange = (editor: Editor | null, font: string) => {
  return editor?.chain().focus().setFontFamily(font).run();
};
