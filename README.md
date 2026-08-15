<div align="center">

<img src="./public/logo.svg" alt="DocX logo" width="96" />

# DocX

**An open-source, AI-powered alternative to Google Docs.**
Write, format, and collaborate on documents in real time — with an AI writing assistant built right into the editor.

<a href="https://github.com/git-init-priyanshu/Docx">
  <img alt="GitHub" src="https://img.shields.io/badge/GitHub-Docx-181717?logo=github" />
</a>
<img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white" />
<img alt="Gemini" src="https://img.shields.io/badge/AI-Gemini%201.5%20Flash-8E75F0?logo=googlegemini&logoColor=white" />

<br />
</div>

---

## ✨ Features

- 📝 **Rich-text editor** — headings, lists, blockquotes, code blocks, text color, highlight, font family, and alignment, powered by [Tiptap](https://tiptap.dev/).
- 🤝 **Real-time collaboration** — multiple people edit the same document simultaneously with live cursors, powered by [Yjs](https://yjs.dev/) over WebSockets. Collaboration is scoped per document, so edits never bleed across files.
- 🤖 **AI writing assistant** — improve writing, fix grammar, translate, summarize, change tone, and more. Press <kbd>⌘K</kbd> for a floating command palette, or use the selection bubble menu — all backed by **Google Gemini 1.5 Flash**.
- 👤 **Guest mode** — start writing instantly without an account. Documents are persisted to `localStorage` until you sign in.
- 🔐 **Google OAuth** via NextAuth — one-click sign in.
- 🗂️ **Document dashboard** — browse your documents with live React-rendered thumbnails, search, and quick-start templates (Blank, Meeting Notes, Project Brief, RFC).
- 💾 **Auto-save** — changes are debounced and saved automatically as you type.
- 🌗 **Light & dark themes** — built on a cohesive design-token system.

---

## 🖼️ Features

### AI assistant in the editor

<div align="center">
  <img src="./public/ai-feature.png" alt="AI writing assistant" width="780" />
</div>

### Real-time collaboration

<div align="center">
  <img src="./public/collab-feature.png" alt="Real-time collaboration" width="780" />
</div>

---

## 🧱 Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | [Next.js 14](https://nextjs.org/) (App Router) + React 18         |
| Language         | TypeScript                                                        |
| Editor           | [Tiptap](https://tiptap.dev/) (ProseMirror)                       |
| Collaboration    | [Yjs](https://yjs.dev/) + [y-websocket](https://github.com/yjs/y-websocket) |
| AI               | [Google Gemini 1.5 Flash](https://ai.google.dev/)                 |
| Auth             | [NextAuth](https://next-auth.js.org/) (Google OAuth)              |
| Database         | PostgreSQL + [Prisma](https://www.prisma.io/)                     |
| Data fetching    | [SWR](https://swr.vercel.app/)                                    |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) + Radix UI + Framer Motion |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Yarn**
- A **PostgreSQL** database
- A **Google OAuth** client (for sign-in)
- A **Gemini API key** (for AI features)
- A running **y-websocket** server (for real-time collaboration)

### 1. Clone & install

```bash
git clone https://github.com/git-init-priyanshu/Docx.git
cd Docx
yarn install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/docx"

# NextAuth (Google OAuth)
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="a-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Real-time collaboration
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:1234"

# Misc
BACKEND_SERVER_URL="http://localhost:4000"
APP_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
yarn db:run   # runs prisma migrate + generate
```

### 4. Start the WebSocket server

In a separate terminal, run a [y-websocket](https://github.com/yjs/y-websocket) server (matching `NEXT_PUBLIC_WEBSOCKET_URL`):

```bash
npx y-websocket --port 1234
```

### 5. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📜 Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `yarn dev`         | Start the development server (`:3000`)       |
| `yarn build`       | Production build                             |
| `yarn start`       | Start the production server                  |
| `yarn lint`        | Run ESLint via Next.js                       |
| `yarn format`      | Format the codebase with Prettier            |
| `yarn db:migrate`  | Run Prisma migrations                        |
| `yarn db:generate` | Regenerate the Prisma client                 |
| `yarn db:run`      | `db:migrate` + `db:generate`                 |

---

## 🗂️ Project Structure

```
app/
├── (auth)/login/        # Google OAuth login page
├── api/auth/            # NextAuth route handler
├── components/          # Marketing landing page sections
├── document/            # Dashboard: list, search, templates
│   └── actions.ts       # Server actions (Prisma mutations)
├── writer/[id]/         # Rich-text editor for a single document
│   └── actions.ts       # Save / generate-text server actions
└── page.tsx             # Landing page
components/               # Shared UI (incl. DocThumbnail)
lib/
├── hooks/               # SWR hooks (useDocs, useDoc)
├── customHooks/         # Session helpers
├── guestServices.ts     # localStorage CRUD for guest mode
└── templates.ts         # Pre-built Tiptap document starters
prisma/schema.prisma      # User, Document, UserOnDocument models
```

---

## 🏗️ How It Works

- **Editor** — Tiptap with `StarterKit`, `Collaboration`, `CollaborationCursor`, and styling extensions. A `Yjs` document and `WebsocketProvider` are created **per document** (room `doc.${docId}`) so documents never sync into one another.
- **Auto-save** — edits are debounced (~1s), persisted through the `UpdateDocData` server action, then the SWR cache is revalidated.
- **AI** — the `generateText` server action calls Gemini 1.5 Flash; results stream back into the editor via the <kbd>⌘K</kbd> palette or the selection bubble menu.
- **Server actions** — every mutation is a `"use server"` action returning `{ success, data?, error? }`, with the session resolved from the NextAuth cookie.
- **Guest mode** — when there's no session, all CRUD runs against `localStorage` via `guestServices.ts`.

---

## 🤝 Contributing

Contributions are welcome! Open an issue to discuss a change, or submit a pull request. Please run `yarn lint` and `yarn format` before committing.

---

## 📄 License

Released as open source. See the repository for license details.
