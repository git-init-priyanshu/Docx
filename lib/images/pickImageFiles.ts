import { ACCEPT_ATTRIBUTE } from "./constants";

/**
 * Opens the file picker without a rendered input.
 *
 * A hidden `<input>` in the tree works for a toolbar button, which is always
 * mounted. The slash menu unmounts the moment an item is chosen, so the input
 * would be gone before the dialog could return. This element is owned by the
 * call instead of by a component.
 */
export function pickImageFiles(onPick: (files: File[]) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ACCEPT_ATTRIBUTE;
  input.multiple = true;

  input.addEventListener(
    "change",
    () => {
      const files = Array.from(input.files ?? []);
      if (files.length > 0) onPick(files);
    },
    { once: true },
  );

  input.click();
}
