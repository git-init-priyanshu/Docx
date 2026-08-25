# Screenshot & video shot list

Captures referenced by the README go in this folder. Keep filenames exactly as
listed — the README's commented-out block points at them.

## Setup for every shot

- Light theme, browser window 1440×900, zoom 100%, dark mode off.
- Hide bookmarks bar and browser chrome where possible (Chrome: `⌘⇧F` for
  fullscreen, or crop it out afterwards).
- Use a real-looking document, not lorem ipsum. A meeting-notes or RFC doc with
  a heading, two paragraphs, a list and a table reads best.
- Never show a real email address, avatar, or document you would not publish.
  Sign in with a throwaway Google account, or blur before committing.
- Crop tightly to the feature: the UI element plus a little surrounding text,
  nothing else. `docs/media/bubble-menu-ai.png` sets the style.
- Export PNG at 2× device pixel ratio, then downscale to ~1560px wide.

## Shots

### ✅ `slash-menu.png` — captured

Editor with an empty paragraph, `/` typed, and the slash menu open showing the
block list (Text, Heading 1–3, lists, Quote, Code block, Divider, Table, Image).
Include the block gutter (drag handle + `+`) on a neighbouring block if you can
get both in frame without the crop looking crowded.

### ✅ `bubble-menu-ai.png` — captured

Text selected, bubble menu open, the Ask AI dropdown showing the suggested and
edit actions.

### ✅ Chat with your documents — captured (video)

The <kbd>⌘J</kbd> Ask bar mid-conversation: a question about a document, the
answer visible, and the citation chips underneath. Pick a question whose answer
is short enough to fit without scrolling.

### ✅ Real-time collaboration — captured (video)

Two windows on the same document, the remote caret and its name flag visible
while the other side types.

### `version-history.png`

Writer right rail on the History tab, with 3–4 version snapshots showing their
thumbnails and timestamps, and the Restore button visible on one of them.

### `tables-and-blocks.png`

A document showing a resizable table with the column controls visible, plus an
image block above or below it — one frame that says "this is a real block
editor", covering the additions from the tables/images work.

### `google-docs-import.gif` (or `.mp4`)

Short screen recording, 8–12 seconds, no audio:

1. Dashboard, click **Import from Google Docs**.
2. Google Drive picker opens, pick a document.
3. Conversion runs, editor opens with the imported content and its images.

Trim the OAuth consent screen if it shows an account email. Keep it under ~4MB
so GitHub renders it inline; if it exceeds that, ship an `.mp4` instead and
reference it as a link rather than an `<img>`.

## Optional extras

- `dashboard.png` — document grid with thumbnails, search, and folders.
- `share-dialog.png` — sharing dialog with link access turned on.
- `dark-mode.png` — the same editor shot in dark theme, for a light/dark pair.

## Video vs image

Images (PNG, and animated GIF) live in this folder and are referenced from the
README as `<img src="./docs/media/...">`. They render anywhere the Markdown is
read.

Video does not work that way: `<img>` cannot hold an MP4, and a `<video>` tag is
stripped from rendered Markdown. To embed a clip, upload it as a **GitHub
attachment** instead — drag the file into a new issue comment, let it upload,
copy the `https://github.com/user-attachments/assets/...` URL it inserts, then
close the tab without submitting. That URL on its own line in the README renders
as an inline player, and the file never has to live in the repo.

Attachment URLs render only on GitHub; elsewhere they appear as a bare link.
That is the accepted trade for not carrying megabytes of video in git.

## After capturing

Uncomment the matching path in the README's screenshot block and turn it into a
real `<img>` section, following the sections above it.
