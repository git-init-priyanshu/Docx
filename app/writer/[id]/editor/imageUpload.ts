import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { isSupportedImage } from "@/lib/images/upload";

export type ImageUploadOptions = {
  upload: (file: File) => Promise<string>;
  onError: (message: string) => void;
};

type PlaceholderId = Record<string, never>;

type PlaceholderAction = {
  add?: { id: PlaceholderId; pos: number };
  remove?: PlaceholderId;
};

const placeholderKey = new PluginKey<DecorationSet>("imageUploadPlaceholder");

/**
 * Tracks in-flight uploads as decorations rather than as document nodes.
 *
 * A node holding a local object URL would be a real document change, so
 * Collaboration would broadcast it to every peer — where that URL resolves to
 * nothing. Close the tab mid-upload and the room keeps a permanently broken
 * image. Decorations are view state, so nothing leaves this browser until the
 * uploaded URL exists.
 */
const placeholderPlugin = new Plugin<DecorationSet>({
  key: placeholderKey,
  state: {
    init: () => DecorationSet.empty,
    apply(tr, value) {
      let set = value.map(tr.mapping, tr.doc);
      const action = tr.getMeta(placeholderKey) as PlaceholderAction | undefined;

      if (action?.add) {
        const element = document.createElement("span");
        element.className = "image-upload-placeholder";
        set = set.add(tr.doc, [
          Decoration.widget(action.add.pos, element, { id: action.add.id }),
        ]);
      }

      if (action?.remove) {
        set = set.remove(
          set.find(undefined, undefined, (spec) => spec.id === action.remove),
        );
      }

      return set;
    },
  },
  props: {
    decorations: (state) => placeholderKey.getState(state),
  },
});

// The document stays editable while an upload runs, so the insertion point is
// read back from the decoration's mapped position rather than from wherever
// the caret was when the file was chosen.
const placeholderPos = (state: EditorState, id: PlaceholderId) => {
  const found = placeholderKey
    .getState(state)
    ?.find(undefined, undefined, (spec) => spec.id === id);
  return found?.length ? found[0].from : null;
};

const imageFilesFrom = (list: FileList | undefined | null) =>
  Array.from(list ?? []).filter(isSupportedImage);

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      /** Uploads each file, inserting it once its URL is known. */
      insertImageFiles: (files: File[], at?: number) => ReturnType;
    };
  }
}

export const ImageUpload = Extension.create<ImageUploadOptions>({
  name: "imageUpload",

  addOptions() {
    return {
      upload: async () => {
        throw new Error("No upload handler configured");
      },
      onError: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      placeholderPlugin,
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const files = imageFilesFrom(event.clipboardData?.files);
            if (files.length === 0) return false;

            event.preventDefault();
            editor.commands.insertImageFiles(files);
            return true;
          },

          handleDrop(view, event, _slice, moved) {
            // `moved` means content is being dragged within the document,
            // which ProseMirror already handles.
            if (moved) return false;

            const files = imageFilesFrom(event.dataTransfer?.files);
            if (files.length === 0) return false;

            event.preventDefault();
            const at = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;
            editor.commands.insertImageFiles(files, at);
            return true;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      insertImageFiles:
        (files: File[], at?: number) =>
        ({ editor, view }) => {
          const images = files.filter(isSupportedImage);
          if (images.length === 0) return false;

          const { upload, onError } = this.options;

          for (const file of images) {
            const id: PlaceholderId = {};

            view.dispatch(
              view.state.tr.setMeta(placeholderKey, {
                add: { id, pos: at ?? view.state.selection.from },
              }),
            );

            upload(file)
              .then((src) => {
                const pos = placeholderPos(view.state, id);
                if (pos === null) return;

                editor
                  .chain()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: { src, alt: file.name },
                  })
                  .run();
              })
              .catch((error: unknown) => {
                onError(
                  error instanceof Error ? error.message : "Upload failed",
                );
              })
              .finally(() => {
                view.dispatch(
                  view.state.tr.setMeta(placeholderKey, { remove: id }),
                );
              });
          }

          return true;
        },
    };
  },
});
