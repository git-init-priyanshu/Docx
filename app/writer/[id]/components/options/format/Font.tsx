import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  setDefaultFontFamily,
  onFontFamilyChange
} from './functions'
import { fontFamily } from './textEditorOptions'

export default function Font({ editor }: any) {
  return (
    <Select
      defaultValue={setDefaultFontFamily(editor)}
      onValueChange={value => onFontFamilyChange(editor, value)}
    >
      <SelectTrigger
        id="model"
        className="items-start [&_[data-description]]:hidden col-span-12 sm:col-span-6 lg:col-span-3 lg:mb-0"
      >
        <SelectValue placeholder="Inter" />
      </SelectTrigger>
      <SelectContent>
        {fontFamily.map((item) => {
          return <SelectItem key={item.title} value={item.font}>{item.title}</SelectItem>
        })}
      </SelectContent>
    </Select>
  )
}
