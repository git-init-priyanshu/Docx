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
<img alt="OpenRouter" src="https://img.shields.io/badge/AI-OpenRouter-8E75F0?logo=openai&logoColor=white" />

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
- 💬 **Chat with your documents (RAG)** — press <kbd>⌘J</kbd> and ask a question across everything you can read. Answers are grounded in retrieved passages and cite them; when nothing relevant is found it says so instead of guessing. It also searches the public library and works without an account (guests are limited to 10 questions an hour).
- 📚 **Library** — a public, read-only collection of Wikipedia articles at `/library`, searchable by title and readable by anyone. Each article credits its source revision under CC BY-SA 4.0.
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

## 📊 RAG Evaluation

The chat pipeline is scored on 347 questions over the 999 Wikipedia articles in the library (48,855 chunks). The runner calls the same `answerQuestion` that `/api/chat` calls.

| Metric                                           | Before       | Now         |
| ------------------------------------------------ | ------------ | ----------- |
| Answer correct                                   | 90.1%        | **97.3%**   |
| Source passage among the 8 the answer model sees | 85.7%        | **98.7%**   |
| Source passage among the 30 retrieved            | 99.0%        | 99.0%       |
| Mean reciprocal rank of the source passage       | 0.814        | 0.944       |
| Answer supported by its passages                 | 99.6%        | 99.3%       |
| Answerable question refused                      | 6.8%         | 1.3%        |
| Unanswerable question refused                    | 100% (48/48) | 98% (49/50) |
| Time to first token, median                      | 17.9 s       | 4.7 s       |

On the 98 test questions alone: 81 of 82 answerable questions correct, the source passage reached the answer model every time, and all 16 unanswerable questions were refused.

### One question, step by step

| Step        | What happens                                                                               | Median time         | Out of 297 answerable questions       |
| ----------- | ------------------------------------------------------------------------------------------ | ------------------- | ------------------------------------- |
| 1. Retrieve | The question is embedded and 30 chunks are pulled from 48,855 by vector and keyword search | 2.5 s               | 294 have the source passage in the 30 |
| 2. Rerank   | A model reads all 30 in full and keeps at most 8                                           | 1.4 s               | 293 still have it in the 8            |
| 3. Answer   | A second model answers from those passages with citations, or refuses                      | first word at 4.7 s | 289 answered correctly                |

The whole reply takes 4.9 s at the median and 6.3 s at the 95th percentile.

The 8 questions it still gets wrong: 3 where search never found the source passage, 1 where the reranker dropped it, 3 answered wrongly with the passage in hand, and 1 refused with the passage in hand. Before the fixes the reranker alone dropped 39.

### Each change, measured

On the 249 dev questions, one change at a time:

| Pipeline                       | Correct | Source passage reaches the answer model | Answerable refused | Median reply |
| ------------------------------ | ------- | --------------------------------------- | ------------------ | ------------ |
| Starting point                 | 91.5%   | 88.2%                                   | 7.1%               | 18.0 s       |
| Reasoning off                  | 92.1%   | 90.7%                                   | 5.6%               | 4.9 s        |
| Reranker reads the whole chunk | 97.7%   | 98.1%                                   | 1.9%               | 4.8 s        |

### What the evals found

- **The reranker was reading 700 characters of 1,600-character chunks.** All 39 source passages it dropped had the answer past that cut, and it never dropped one whose answer it could see. Reading the whole chunk took correct answers from 92.1% to 97.7% on the dev questions at the same latency.
- **Hidden reasoning cost 13 seconds per question and bought nothing.** With reasoning off for reranking and answering, correct answers stayed at 91.9% on the same dev questions and the median reply dropped from 18.0 s to 4.9 s.
- **Matching any keyword instead of all of them was not worth it.** It retrieved one more source passage out of 215 and made the search 190 ms slower, so it was left out.

### How it is measured

- **Corpus**: [Wikipedia Vital Articles, Level 3](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level_3), each article pinned to a revision in `evals/corpus/manifest.json`. Text is from Wikipedia under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- **Answerable questions (297)**: `qwen/qwen3.8-flash` writes a question, a reference answer and a verbatim evidence quote from one sampled chunk of 297 different articles. The source passage is the chunk of that article containing the quote.
- **Unanswerable questions (50)**: half ask for a detail no encyclopedia records, half ask about people and places that do not exist. The right reply is the fixed refusal.
- **Correct and supported**: a judge model compares each answer with the reference answer, and separately checks every claim against the passages the answer model was given.
- **Split**: 249 dev questions for trying changes, 98 test questions, assigned by question id.

### Caveats

- The questions are written by a model from the passage itself, so they sit closer to the source wording than a real person's question would.
- The answer model has very likely read Wikipedia. The refusal and supported-by-passages rows are the check that answers come from the passages.
- The judge is a model from the same family as the reranker, and its verdicts have not been checked by hand. The one unanswerable question that got answered (a page count for a Marx draft) appears to be answerable from the corpus.
- The source-passage rows are a lower bound: another article can hold the same fact.
- The reranker fix came from looking at failures in both splits, so the test questions are not a clean holdout for that change.
- Two runs of the same code differed by one point on the dev questions (97.7% and 96.7% correct).
- The "Before" run lost 6 questions to a network drop and is scored on the other 341.
- Latency was measured from a laptop. 1.9 s of every reply is the query embedding call.

### Checks on the setup

- **Old and new embeddings are interchangeable.** The same text embedded through OpenRouter matched the stored Gemini vector at cosine 1.0000.
- **Personal documents still get semantic hits next to the library.** About 48,800 library chunks share the vector index with 48 personal chunks. Using the first 160 characters of the 22 longer personal chunks as the question, the index returned the right document in the top 30 every time (22 of 22), the same as an exact scan with the index turned off. The questions are copied from the source text, so this shows the index is not hiding personal chunks, not how well paraphrased questions would do. No change to the index settings was needed.

### Run it

```bash
node evals/corpus/downloadHtml.ts                    # fetch the pinned revisions (about 1 GB, cached)
node --env-file=.env evals/corpus/importCorpus.ts    # write them as public documents
node --env-file=.env scripts/backfill-embeddings.ts  # chunk and embed
node --env-file=.env evals/run.ts my-change dev      # or test, or all
```

Each run writes `evals/results/<label>.json` with every question, answer, verdict and timing. Running a label again retries only the questions that errored. The table above is `baseline.json` and `final.json`.

---

## 🧱 Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | [Next.js 14](https://nextjs.org/) (App Router) + React 18         |
| Language         | TypeScript (Node 24, Yarn 4)                                      |
| Editor           | [Tiptap 3](https://tiptap.dev/) (ProseMirror)                     |
| Collaboration    | [Yjs](https://yjs.dev/) + [y-websocket](https://github.com/yjs/y-websocket) |
| AI               | [OpenRouter](https://openrouter.ai/) for generation and embeddings (`google/gemini-embedding-001`) |
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
- An **OpenRouter API key** (text generation and embeddings)
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

# AI text generation (writing assistant, chat answers, reranking)
OPENROUTER_API_KEY="sk-or-v1-..."

# Optional model overrides — see lib/ai/models.ts for the defaults
# OPENROUTER_WRITER_MODEL="qwen/qwen3.8-flash"
# OPENROUTER_ANSWER_MODEL="deepseek/deepseek-v4-flash-0731"
# OPENROUTER_RERANK_MODEL="qwen/qwen3.8-flash"
# OPENROUTER_CONDENSE_MODEL="deepseek/deepseek-v4-flash-0731"
# OPENROUTER_EMBEDDING_MODEL="google/gemini-embedding-001"

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
├── library/             # Public Wikipedia articles: list, search, read-only article
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
├── rag/                 # chunk, embed, index, search, rerank, answer, pipeline
├── googleDocs/          # Drive picker, fetch, Tiptap conversion, image re-host
├── images/              # Upload, signed reads, blob paths
├── tiptap/markdown.ts   # Tiptap JSON to Markdown / plain text
├── hooks/               # SWR hooks (useDocs, useDoc, useVersions)
├── guestServices.ts     # localStorage CRUD for guest mode
└── templates.ts         # Pre-built Tiptap document starters
evals/
├── corpus/              # Wikipedia manifest, download, Tiptap conversion, import
├── questions.jsonl      # 347 questions with reference answers and evidence quotes
├── run.ts               # Runs the chat pipeline over the questions and scores it
└── results/             # One JSON file per labelled run
prisma/schema.prisma      # User, Document, DocumentChunk, ChatThread, versions…
scripts/backfill-embeddings.ts
```

---

## 🏗️ How It Works

- **Editor** — Tiptap 3 with `StarterKit`, `Collaboration`, `CollaborationCaret`, tables, images, placeholders, a custom slash-menu extension, and styling extensions. A Yjs document and `WebsocketProvider` are created **per document** (room `doc.${docId}`) so documents never sync into one another. Local undo/redo stays off — that is Yjs's job once collaboration is attached.
- **Auto-save & versions** — edits are debounced (~1s) and persisted through the `UpdateDocData` server action, a version snapshot is taken at most once a minute, then the SWR cache is revalidated.
- **Inline AI** — the `generateText` server action calls OpenRouter; results are inserted with paragraph structure preserved, from the <kbd>⌘K</kbd> palette, the bubble menu, or the right rail.
- **Chat (RAG)** — documents are chunked on heading boundaries (~1600 chars, with the heading path carried into the embedding), embedded with `google/gemini-embedding-001` through OpenRouter, truncated to 768 dimensions, and stored in a `vector(768)` column beside a generated `tsvector`. A question is condensed against chat history, retrieved twice (cosine distance and `ts_rank_cd`), fused with Reciprocal Rank Fusion, reranked by a model, then answered from the top passages with citations. Retrieval covers public library documents plus documents you own or collaborate on; visitors without an account search the library only. The route streams NDJSON, so each stage — condense, retrieve, rerank, generate — is visible as it happens.
- **Images** — the browser uploads straight to a private Blob store with a presigned token whose constraints are signed in, so bytes never cross the serverless request-body limit. Reads go through `/api/image/...`, which checks document access and redirects to a short-lived signed URL: an image is exactly as private as its document.
- **Google Docs import** — the picker runs in the browser with the `drive.file` scope, the doc is converted to Tiptap, images are re-hosted into Blob storage before anything is saved, and an "as imported" version snapshot is written.
- **Server actions** — every mutation is a `"use server"` action returning `{ success, data?, error? }`, with the session resolved from the NextAuth cookie.
- **Guest mode** — with no session, documents and versions run against `localStorage` via `guestServices.ts`. Sharing needs an account; chat does not. Guests' own documents stay in the browser and are not searched.

---

## 🤝 Contributing

Contributions are welcome! Open an issue to discuss a change, or submit a pull request. Please run `yarn lint` and `yarn format` before committing.

---

## 📄 License

Released as open source. See the repository for license details.
