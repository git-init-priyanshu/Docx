import { Textarea } from "@/components/ui/textarea"

import Header from "./components/Header"
import Options from "./components/Options"
import Tabs from "./components/Tabs"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export default function Dashboard() {
  return (
    <div className="h-screen overflow-hidden w-full ">
      <Header />
      <div className="flex h-full">
        <Tabs />
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <Options />
          <ScrollArea className="col-span-2">
            <Textarea
              id="message"
              className="h-full resize-none mb-4 border p-8 shadow-none focus-visible:ring-0"
            />
            <Textarea
              id="message"
              className="h-full resize-none border p-8 shadow-none focus-visible:ring-0"
            />
          </ScrollArea>
        </div>
      </div>
    </div >
  )
}
