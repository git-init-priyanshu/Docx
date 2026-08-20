import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { SlashItem } from "./items";

export type SlashMenuListHandle = {
  /** Returns true when the key was consumed, which stops the editor seeing it. */
  onKeyDown: (event: KeyboardEvent) => boolean;
};

type SlashMenuListProps = {
  items: SlashItem[];
  command: (item: SlashItem) => void;
};

const SlashMenuList = forwardRef<SlashMenuListHandle, SlashMenuListProps>(
  function SlashMenuList({ items, command }, ref) {
    const [selected, setSelected] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Filtering can shrink the list under the cursor, which would otherwise
    // leave the highlight pointing past the end and Enter selecting nothing.
    useEffect(() => setSelected(0), [items]);

    useEffect(() => {
      itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
    }, [selected]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (items.length === 0) return false;

        if (event.key === "ArrowUp") {
          setSelected((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelected((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          command(items[selected]);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="w-[19rem] rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] p-3 text-[13px] text-[var(--lp-muted)] shadow-lg">
          No matching blocks
        </div>
      );
    }

    return (
      <div className="max-h-[19rem] w-[19rem] overflow-y-auto rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] p-1 shadow-lg">
        {items.map((item, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={item.title}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              // The editor keeps focus, so the caret and the suggestion range
              // both survive until the command runs.
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setSelected(index)}
              onClick={() => command(item)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                isSelected
                  ? "bg-[color-mix(in_oklab,var(--lp-accent)_12%,transparent)]"
                  : "bg-transparent"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--lp-border)] bg-[var(--lp-paper-2)] text-[var(--lp-ink)]">
                <item.Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-[var(--lp-ink)]">
                  {item.title}
                </span>
                <span className="block truncate text-[11.5px] text-[var(--lp-muted)]">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

export default SlashMenuList;
