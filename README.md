<div align="center">

<img src="./public/logo.svg" alt="DocX logo" width="96" />

# DocX

**An open-source, AI-powered alternative to Google Docs.**
Write, format, and collaborate on documents in real time — with an AI writing assistant in the editor and a chat that answers questions from your own documents.

<a href="https://github.com/git-init-priyanshu/Docx">
  <img alt="GitHub" src="https://img.shields.io/badge/GitHub-Docx-181717?logo=github" />
</a>
<img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
<img alt="Tiptap" src="https://img.shields.io/badge/Tiptap-3-2B2E3A" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white" />
<img alt="Gemini" src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75F0?logo=googlegemini&logoColor=white" />

<br />
</div>

---

## ✨ Features

### Writing

- 📝 **Block editor** — headings, lists, blockquotes, code blocks, dividers, tables, images, text color, highlight, font family, and alignment, powered by [Tiptap 3](https://tiptap.dev/).
- ⌨️ **Slash menu** — type `/` anywhere to insert a block: text, headings 1–3, bulleted and numbered lists, quote, code block, divider, table, image.
- ⠿ **Block gutter** — hover a block for a drag handle to reorder it and a `+` to insert below.
- 🔤 **Selection bubble menu** — formatting and AI actions follow the selection, positioned with [Floating UI](https://floating-ui.com/).
- 🖼️ **Images** — insert or paste; uploaded straight from the browser to a **private** Vercel Blob store via presigned URLs, then served only to people who can read the document.
- 📐 **Tables** — resizable columns with row/column controls; column widths reach collaborators like any other edit.

### Collaboration & history

- 🤝 **Real-time collaboration** — multiple people edit the same document simultaneously with live cursors, powered by [Yjs](https://yjs.dev/) over WebSockets. Rooms are scoped per document (`doc.${docId}`), so edits never bleed across files.
- 🔗 **Link sharing** — invite collaborators, or turn on link access so anyone holding the URL can open and edit (and joins as a collaborator when they do).
- 🕘 **Version history** — snapshots are captured as you write (at most one a minute, 50 kept). Preview any version as a thumbnail and restore it in one click. Works in guest mode too.
- 💾 **Auto-save** — changes are debounced ~1s and saved automatically; pending saves are flushed on navigation.

### AI

- 🤖 **AI writing assistant** — improve writing, fix grammar, translate, summarize, change tone, tighten, expand, counter-argue. Press <kbd>⌘K</kbd> for the floating command palette, or use the selection bubble menu or the right rail.
- 💬 **Chat with your documents (RAG)** — press <kbd>⌘J</kbd> and ask a question across everything you can read. Answers are grounded in retrieved passages and cite them; when nothing relevant is found it says so instead of guessing.
- 🚦 **Usage limits** — AI calls are rate-limited per user on a rolling hourly window, recorded in Postgres rather than in memory (serverless instances share none).

### Documents

- 📥 **Import from Google Docs** — pick a doc through the Google Drive picker and it is converted to Tiptap, with its images re-hosted into Blob storage so nothing is saved pointing at an expiring Google URL. The access token stays in the browser and is never persisted.
- 📤 **Export** — download as Markdown (`.md`) or plain text (`.txt`).
- 🗂️ **Dashboard** — browse documents with React-rendered thumbnails (drawn from a stored `preview`, so listing never downloads document bodies), search, folders, and quick-start templates (Blank, Meeting Notes, Project Brief, RFC).
- 👤 **Guest mode** — start writing instantly without an account; documents and versions live in `localStorage` until you sign in.
- 🔐 **Google OAuth** via NextAuth — one-click sign in.
- 🌗 **Light & dark themes** — built on a cohesive design-token system.

---

## 🖼️ Screenshots

### Real-time collaboration

Two people editing the same document, with live cursors.

https://github.com/user-attachments/assets/fda80969-9bd2-4a64-8a98-75c5b4092fc2

### Slash menu

Type `/` on any empty line to insert a block.

<div align="center">
  <img src="./docs/media/slash-menu.png" alt="Slash menu open on an empty paragraph" width="780" />
</div>

### AI actions on a selection

<div align="center">
  <img src="./docs/media/bubble-menu-ai.png" alt="Bubble menu with AI actions: improve writing, fix grammar, summarize, translate, make longer, make shorter, simplify" width="520" />
</div>

### Chat with your documents

Ask a question across everything you can read, and get an answer that cites the passages it came from.

https://github.com/user-attachments/assets/5694c22d-ae5b-4bec-b1e0-2be99d3a8293

<!--
Captures still to add (shot list: docs/media/CAPTURE.md):
  ./docs/media/tables-and-blocks.png
  ./docs/media/version-history.png
  ./docs/media/google-docs-import.gif
-->

---

## 🧱 Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | [Next.js 14](https://nextjs.org/) (App Router) + React 18         |
| Language         | TypeScript (Node 24, Yarn 4)                                      |
| Editor           | [Tiptap 3](https://tiptap.dev/) (ProseMirror)                     |
| Collaboration    | [Yjs](https://yjs.dev/) + [y-websocket](https://github.com/yjs/y-websocket) |
| AI               | [Google Gemini 2.5 Flash](https://ai.google.dev/) + `gemini-embedding-001` |
| Retrieval        | Postgres [pgvector](https://github.com/pgvector/pgvector) + `tsvector`, fused with Reciprocal Rank Fusion |
| Auth             | [NextAuth](https://next-auth.js.org/) (Google OAuth)              |
| Database         | PostgreSQL + [Prisma](https://www.prisma.io/)                     |
| File storage     | [Vercel Blob](https://vercel.com/docs/vercel-blob) (private)      |
| Data fetching    | [SWR](https://swr.vercel.app/)                                    |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) + Radix UI + Framer Motion |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 24+
- **Yarn** 4 (`corepack enable`)
- A **PostgreSQL** database where the **pgvector** extension can be created (Neon works out of the box)
- A **Google OAuth** client (sign-in, and the Google Docs importer)
- A **Gemini API key** (AI features)
- A **Vercel Blob** store (image uploads)
- A running **y-websocket** server (real-time collaboration)

### 1. Clone & install

```bash
git clone https://github.com/git-init-priyanshu/Docx.git
cd Docx
yarn install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Database (the migrations create the pgvector extension)
DATABASE_URL="postgresql://user:password@localhost:5432/docx"

# NextAuth (Google OAuth)
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="a-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# AI (writing assistant, embeddings, chat)
GEMINI_API_KEY="your-gemini-api-key"

# Real-time collaboration
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:1234"

# Image uploads (private Vercel Blob store)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Google Docs import (Drive Picker, browser-side)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_GOOGLE_PICKER_KEY="your-google-api-key"
NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER="your-gcp-project-number"
```

The importer needs the **Google Picker API** and **Google Docs API** enabled on the same GCP project as the OAuth client. It only ever requests the `drive.file` scope — access to the exact files a user hands over through the picker.

### 3. Set up the database

```bash
yarn db:run   # runs prisma migrate + generate
```

### 4. Start the WebSocket server

In a separate terminal, run a [y-websocket](https://github.com/yjs/y-websocket) server matching `NEXT_PUBLIC_WEBSOCKET_URL`:

```bash
npx y-websocket --port 1234
```

### 5. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 6. (Optional) Index existing documents for chat

New and edited documents are indexed automatically. Backfill anything that predates the feature — or any change to chunking or the embedding model:

```bash
node --env-file=.env scripts/backfill-embeddings.ts
```

Safe to re-run: unchanged documents are skipped without an API call.

---

## 📜 Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `yarn dev`          | Start the development server (`:3000`)       |
| `yarn build`        | Production build                             |
| `yarn start`        | Start the production server                  |
| `yarn lint`         | Run ESLint via Next.js                       |
| `yarn lint:check`   | Run ESLint directly                          |
| `yarn format`       | Format the codebase with Prettier            |
| `yarn format:check` | Check formatting without writing             |
| `yarn db:migrate`   | Run Prisma migrations                        |
| `yarn db:generate`  | Regenerate the Prisma client                 |
| `yarn db:run`       | `db:migrate` + `db:generate`                 |
| `yarn install:prod` | Install dependencies, then `db:run`          |

---

## ⌨️ Shortcuts

| Keys          | Action                        |
| ------------- | ----------------------------- |
| <kbd>⌘K</kbd> | Ask palette (AI on selection) |
| <kbd>⌘J</kbd> | Chat with your documents      |
| <kbd>⌘N</kbd> | New document                  |
| `/`           | Slash menu (insert a block)   |

---

## 🗂️ Project Structure

```
app/
├── (auth)/login/        # Google OAuth login page
├── api/
│   ├── auth/            # NextAuth route handler
│   ├── chat/            # Streaming RAG answers (NDJSON)
│   ├── image/[...path]/ # Access-checked redirect to a presigned Blob URL
│   └── upload/          # Presigned upload tokens for browser → Blob
├── components/          # Marketing landing page sections
├── document/            # Dashboard: list, search, folders, templates
│   ├── import/          # Google Docs import action
│   └── actions.ts       # Server actions (Prisma mutations)
├── writer/[id]/         # Editor for a single document
│   ├── editor/          # Tiptap config, slash menu, image upload
│   ├── components/      # Bubble menu, block handle, table controls, right rail
│   ├── rag/             # Indexing for this document
│   ├── sharing/         # Collaborators + link access
│   └── versions/        # Snapshot / restore actions and policy
└── page.tsx             # Landing page
components/
├── AskBar/              # ⌘J chat over your documents
└── DocThumbnail.tsx     # Pure-React Tiptap preview renderer
lib/
├── rag/                 # chunk, embed, index, search, rerank, answer
├── googleDocs/          # Drive picker, fetch, Tiptap conversion, image re-host
├── images/              # Upload, signed reads, blob paths
├── tiptap/markdown.ts   # Tiptap JSON to Markdown / plain text
├── hooks/               # SWR hooks (useDocs, useDoc, useVersions)
├── guestServices.ts     # localStorage CRUD for guest mode
└── templates.ts         # Pre-built Tiptap document starters
prisma/schema.prisma      # User, Document, DocumentChunk, ChatThread, versions…
scripts/backfill-embeddings.ts
```

---

## 🏗️ How It Works

- **Editor** — Tiptap 3 with `StarterKit`, `Collaboration`, `CollaborationCaret`, tables, images, placeholders, a custom slash-menu extension, and styling extensions. A Yjs document and `WebsocketProvider` are created **per document** (room `doc.${docId}`) so documents never sync into one another. Local undo/redo stays off — that is Yjs's job once collaboration is attached.
- **Auto-save & versions** — edits are debounced (~1s) and persisted through the `UpdateDocData` server action, a version snapshot is taken at most once a minute, then the SWR cache is revalidated.
- **Inline AI** — the `generateText` server action calls Gemini 2.5 Flash; results are inserted with paragraph structure preserved, from the <kbd>⌘K</kbd> palette, the bubble menu, or the right rail.
- **Chat (RAG)** — documents are chunked on heading boundaries (~1600 chars, with the heading path carried into the embedding), embedded with `gemini-embedding-001` truncated to 768 dimensions, and stored in a `vector(768)` column beside a generated `tsvector`. A question is condensed against chat history, retrieved twice (cosine distance and `ts_rank_cd`), fused with Reciprocal Rank Fusion, reranked by a model, then answered from the top passages with citations. Retrieval is scoped to documents you own or collaborate on. The route streams NDJSON, so each stage — condense, retrieve, rerank, generate — is visible as it happens.
- **Images** — the browser uploads straight to a private Blob store with a presigned token whose constraints are signed in, so bytes never cross the serverless request-body limit. Reads go through `/api/image/...`, which checks document access and redirects to a short-lived signed URL: an image is exactly as private as its document.
- **Google Docs import** — the picker runs in the browser with the `drive.file` scope, the doc is converted to Tiptap, images are re-hosted into Blob storage before anything is saved, and an "as imported" version snapshot is written.
- **Server actions** — every mutation is a `"use server"` action returning `{ success, data?, error? }`, with the session resolved from the NextAuth cookie.
- **Guest mode** — with no session, documents and versions run against `localStorage` via `guestServices.ts`. Chat and sharing need an account.

---

## 🤝 Contributing

Contributions are welcome! Open an issue to discuss a change, or submit a pull request. Please run `yarn lint` and `yarn format` before committing.

---

## 📄 License

Released as open source. See the repository for license details.
