import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";

import { filterSlashItems, type SlashItem } from "./items";
import SlashMenuList, { type SlashMenuListHandle } from "./SlashMenuList";

const slashMenuKey = new PluginKey("slashMenu");

type SlashRenderer = ReactRenderer<SlashMenuListHandle>;

const render: SuggestionOptions<SlashItem, SlashItem>["render"] = () => {
  let component: SlashRenderer | null = null;
  let unmount: (() => void) | null = null;

  const teardown = () => {
    unmount?.();
    component?.destroy();
    unmount = null;
    component = null;
  };

  return {
    onStart: (props) => {
      component = new ReactRenderer(SlashMenuList, {
        props,
        editor: props.editor,
      });
      // `mount` hands positioning to the plugin, which keeps the popup anchored
      // to the caret through scrolling, resizing and layout shifts.
      unmount = props.mount(component.element);
    },

    onUpdate: (props) => component?.updateProps(props),

    onKeyDown: ({ event }) => {
      if (event.key === "Escape") {
        teardown();
        return true;
      }
      return component?.ref?.onKeyDown(event) ?? false;
    },

    onExit: teardown,
  };
};

/**
 * The `/` menu.
 *
 * `startOfLine` is deliberately off: a slash partway through a line is far more
 * often a date or a path than a command, but requiring an empty block would
 * also stop the menu working after a few words of an unfinished sentence. The
 * `allow` check below is what draws that line instead.
 */
export const SlashMenu = Extension.create({
  name: "slashMenu",

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        pluginKey: slashMenuKey,
        char: "/",
        startOfLine: false,
        items: ({ query }) => filterSlashItems(query),
        command: ({ editor, range, props }) => props.run(editor, range),
        // Code blocks take a slash as content, and a slash immediately after a
        // word is part of that word rather than the start of a command.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          if ($from.parent.type.spec.code) return false;

          const before = state.doc.textBetween(
            Math.max(0, range.from - 1),
            range.from,
          );
          return before === "" || /\s/.test(before);
        },
        render,
      }),
    ];
  },
});
