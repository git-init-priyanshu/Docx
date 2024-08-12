import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  setDefaultStyleValue,
  onFontStyleChange,
} from './functions'

export default function Heading({ editor }: any) {
  return (
    <Select
      value={setDefaultStyleValue(editor)}
      onValueChange={value => onFontStyleChange(editor, value)}
    >
      <SelectTrigger
        id="model"
        className="items-start [&_[data-description]]:hidden col-span-12 sm:col-span-6 lg:mb-0"
      >
        <SelectValue placeholder="Normal" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="heading 1">Heading 1</SelectItem>
        <SelectItem value="heading 2">Heading 2</SelectItem>
        <SelectItem value="heading 3">Heading 3</SelectItem>
        <SelectItem value="heading 4">Heading 4</SelectItem>
        <SelectItem value="heading 5">Heading 5</SelectItem>
        <SelectItem value="heading 6">Heading 6</SelectItem>
      </SelectContent>
    </Select>
  )
}
