# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Quality

- Keep code clean and readable. If a file grows large or mixes unrelated concerns, split it into multiple focused files rather than appending to the existing one.
- Prefer small, single-responsibility components and modules. A component that handles both data fetching and complex rendering should be split into a container and a presentational piece.

## Commits

When asked to commit changes, group files by logical concern and create one commit per group rather than a single catch-all commit. For example, a feature that touches the editor, a server action, and a shared hook should produce three separate commits, each with a message scoped to what changed in that group.

## Commands

```bash
yarn dev          # Start development server (localhost:3000)
yarn build        # Production build
yarn lint         # ESLint via Next.js
yarn format       # Prettier write
yarn db:migrate   # Run Prisma migrations
yarn db:generate  # Regenerate Prisma client
yarn db:run       # migrate + generate (run after schema changes)
```

There are no automated tests in this project.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `GOOGLE_ID` / `GOOGLE_SECRET` — NextAuth Google OAuth
- `NEXTAUTH_SECRET` — NextAuth session secret
- `NEXTAUTH_URL` — Base URL NextAuth uses for callbacks (e.g. `http://localhost:3000`)
- `GEMINI_API_KEY` — Google Gemini AI (used for text generation in the editor)
- `NEXT_PUBLIC_WEBSOCKET_URL` — WebSocket server URL for Yjs real-time collaboration
- `BACKEND_SERVER_URL` — Backend service for thumbnail upload queue
- `APP_URL` — Base URL

## Architecture

### Routes
- `/` — Marketing landing page (`app/page.tsx` + `app/components/`)
- `/login` — Single Google-OAuth login page (`app/(auth)/login/`)
- `/document` — Dashboard: lists all user documents
- `/writer/[id]` — Rich-text editor for a single document

### Authentication
Google OAuth via NextAuth is the only auth path. The session lives in the `next-auth.session-token` cookie. There is no email/password flow, OTP verification, or password reset.

`useClientSession` (`lib/customHooks/useClientSession.tsx`) wraps `useSession` from `next-auth/react` and returns `null` while loading, or a `{ id, name, email, image }` object. Unauthenticated users get an object with `id: undefined`. The server-side counterpart `getServerSession` (`lib/customHooks/getServerSession.ts`) wraps NextAuth's `getServerSession` with the same shape.

### Guest Mode
Unauthenticated users can create and edit documents locally. All guest data lives in `localStorage` (user profile + document list). `lib/guestServices.ts` handles all CRUD. The document page and editor both branch on `session?.id` to decide whether to hit the DB or `localStorage`.

### Editor (`app/writer/[id]/`)
- **Tiptap** with `StarterKit`, `Collaboration`, `CollaborationCursor`, `Color`, `Highlight`, `Underline`, `TextAlign`, `FontFamily`, `TextStyle`.
- **Yjs + y-websocket** for real-time collaboration. The `ydoc` and `provider` are module-level singletons in `editor/editorConfig.ts` — the room name is date-based (shared across all users on the same calendar day).
- Auto-save via a 1-second debounce: on change, calls `UpdateDocData` server action and then `invalidateDoc` to update the SWR cache.
- `⌘K` opens `AskPalette` — a floating command palette for AI text operations.
- Bubble menu appears on text selection with AI actions (improve writing, fix grammar, translate, summarize, etc.) via `generateText` server action → Gemini 1.5 Flash.

### Data Fetching (SWR)
- `lib/hooks/useDocs.ts` — fetch all documents for a user; export `invalidateDocs(userId?)` after mutations.
- `lib/hooks/useDoc.ts` — fetch a single document; export `invalidateDoc(id)` after save.
- Server actions (`app/document/actions.ts`, `app/writer/[id]/actions.ts`) are the mutation layer; they call Prisma directly and return `{ success, data?, error? }`.

### Design Tokens
All UI uses CSS custom properties prefixed `--lp-*` defined in `app/globals.css`. Both light and dark variants are defined in `:root` and `.dark`. Key tokens:
- `--lp-paper` / `--lp-paper-2` — background surfaces
- `--lp-ink` / `--lp-ink-2` — text
- `--lp-muted` — secondary text
- `--lp-border` — borders/dividers
- `--lp-card` — card/document background
- `--lp-accent` / `--lp-accent-soft` / `--lp-accent-ink` — interactive accent
- `--lp-tan`, `--lp-leaf`, `--lp-rose` — template/category accent colors

Always use Tailwind CSS for styling wherever possible, including for `--lp-*` tokens via arbitrary-value classes (e.g. `bg-[var(--lp-card)]`, `text-[var(--lp-ink)]`, `border-[var(--lp-border)]`). For `color-mix()` values, replace spaces with underscores inside the brackets (e.g. `bg-[color-mix(in_oklab,var(--lp-rose)_15%,var(--lp-card))]`). Only fall back to inline `style` props when Tailwind cannot express the value (e.g. dynamic runtime values).

### Document Thumbnail
`components/DocThumbnail.tsx` renders a scaled pure-React preview of a Tiptap JSON document — it replaced html2canvas. It parses the stored JSON and renders nodes (heading, paragraph, bulletList, blockquote, codeBlock) at 40% scale. Pass `data` (the raw JSON string from the DB) and optionally `accentColor` for a top stripe.

### Server Actions Pattern
All data mutations use Next.js server actions (`"use server"`). They all return `{ success: boolean, data?: T, error?: string }`. Session is retrieved via `getServerSession` (`lib/customHooks/getServerSession.ts`) which decodes whichever auth cookie is present.

### Database Schema
Three models: `User`, `Document`, `UserOnDocument` (join table). A document can have multiple collaborators via `UserOnDocument`. The `createdBy` relation tracks the owner. Document `data` is stored as a JSON string (Tiptap document format).

### Templates
`lib/templates.ts` exports `TEMPLATES: Template[]` — pre-built Tiptap JSON document starters (Blank, Meeting Notes, Project Brief, RFC). Used in the QuickStart component on the document dashboard.
