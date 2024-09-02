import { useRouter } from "next/navigation";
import { ALargeSmall, Redo, Undo, X } from "lucide-react";
import { Editor } from "@tiptap/react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg"

import Heading from "../options/format/Heading";
import Font from "../options/format/Font";
import FormattingBtns from "../options/format/FormattingBtns";
import ColorHighlight from "../options/format/ColorHighlight";
import ParagraphBtns from "../options/format/ParagraphBtns";
import Image from "next/image";

type HeaderPropType = {
  editor: Editor | null;
  name: string;
  isSaving: boolean;
};

export default function Header({ editor, name, isSaving }: HeaderPropType) {
  const router = useRouter();

  return (
    <header className="flex h-[57px] items-center gap-1 border-b bg-background">
      <div className="p-2 lg:border-r">
        <Button variant="outline" size="icon" onClick={() => router.push("/")}>
          {/* <Triangle className="size-5 fill-foreground" /> */}
          <Image src={logo} width={25} alt="logo" />
        </Button>
      </div>

      <div className="w-full flex justify-between">
        <div className="flex items-center">
          {name ? (
            <h1 className="text-md truncate hidden lg:block lg:max-w-[40rem] lg:text-xl font-semibold mx-4">
              {name}
            </h1>
          ) : (
            <div className="h-7 w-40 rounded hidden lg:block bg-neutral-100 animate-pulse mx-4"></div>
          )}

          <Button
            onClick={() => editor?.commands.undo()}
            variant="ghost"
            className="px-3 rounded-md"
          // disabled={!editor?.can().chain().focus().undo().run()}
          >
            <Undo size={15} />
          </Button>
          <Button
            onClick={() => editor?.commands.redo()}
            variant="ghost"
            className="px-3 rounded-md"
          // disabled={!editor?.can().chain().focus().redo().run()}
          >
            <Redo size={15} />
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="px-3 rounded-md block lg:hidden"
              >
                <ALargeSmall size={15} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="block lg:hidden">
              <DrawerHeader className="flex justify-between items-center sm:px-20">
                <DrawerTitle>Format</DrawerTitle>
                <DrawerClose>
                  <Button variant="ghost" className="p-0">
                    <X size={20} />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="grid gap-4 grid-cols-12 p-4 sm:px-20">
                <Heading editor={editor} />
                <Font editor={editor} />
                <FormattingBtns editor={editor} />
                <ColorHighlight editor={editor} />
                <ParagraphBtns editor={editor} />
              </div>
            </DrawerContent>
          </Drawer>

          {isSaving ? (
            <>
              <svg
                className="hidden lg:block animate-spin lucide lucide-loader-circle ml-4"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p className="hidden lg:block ">Saving...</p>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* <Button */}
        {/*   variant="outline" */}
        {/*   size="icon" */}
        {/*   className='mr-4 lg:hidden' */}
        {/*   onClick={() => setIsDrawerOpen(!isDrawerOpen)} */}
        {/* > */}
        {/*   <AlignJustify */}
        {/*     className="size-5 fill-foreground" */}
        {/*   /> */}
        {/* </Button> */}
      </div>
    </header>
  );
}
