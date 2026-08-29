# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start the dev server (Next.js, Turbopack)
- `pnpm build` - Build for production
- `pnpm start` - Serve the production build
- `pnpm lint` - ESLint

There is no working test command. `vitest`, `jsdom`, and Testing Library are
installed and three layout tests exist under `src/components/layout/`, but there
is no vitest config and no `test` script, and running `vitest` fails on the
Tailwind 4 PostCSS config (vitest 1.6 / vite 5). Fix the config before adding
tests, or the new ones will not run either.

## Architecture Overview

A Next.js app for a Korean–Japanese manga catalog: books, authors, and the
many-to-many between them.

### Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19 with the React Compiler
- **Database**: local SQLite (`managn.db`) via Drizzle ORM + `@libsql/client`
- **Styling**: Tailwind CSS 4, shadcn-style components under `src/components/ui/`
- **Tables**: AG Grid (`src/components/admin/*-data-table.tsx`)
- **Search**: Fuse.js
- **Deployment**: Vercel

### Database Schema

`src/lib/db/schema.ts` — three tables:

- `books` — `id`, `status` (`release` | `draft`, declared as a Drizzle enum), `link`, `title_ko`, `title_ja`, `cover`
- `authors` — `id`, `name_ko`, `name_ja`
- `book_authors` — the join table; `book_id` and `author_id` both nullable

The Drizzle schema is the source of truth for the shape. `managn.db` is
committed and read as `file:managn.db`, so **the database is local-only** — a
Vercel deployment gets a read-only snapshot at build time and cannot be written
to. This is why every admin surface is dev-only.

### Data Access Layer (`src/lib/data/`)

All reads and writes go through typed helpers; pages never build queries.

- `books.ts` — `getReleasedBooks()`, `getReleasedBooksByAuthor()`,
  `getReleasedBooksByPageSize()`, `getRandomBooks()`, `getBookById()`,
  `insertBook()`, `updateBookData()`, `createBookAuthor()`, `deleteBookAuthor()`
- `authors.ts` — `getAuthorsWithBooks()`, `getAuthorById()`, `getAuthorsByIds()`,
  `insertAuthorData()`, `updateAuthorData()`
- `helpers.ts` — `createCoverUrl()`, `parseAuthorData()`, `parseBookData()`,
  `buildBooksWithAuthorsQuery()`. The parse helpers exist because the
  book-with-authors query aggregates authors into a JSON string in SQL, which is
  then validated with Zod on the way out.

Covers live in `public/books/`, and `books.cover` holds the filename. Older
covers are named `{id}.webp`; anything uploaded through Comp gets a name its
store invented, which is why `createCoverUrl()` reads the column and only falls
back to the id convention. Both write paths convert to WebP with imagemin —
`src/lib/services/image.ts` for the hand-built admin, `src/lib/comp/cover-store.ts`
for Comp — and both write to the local filesystem, so covers only persist in
development.

### Mutations

Server Actions in `src/actions/index.ts`, not API routes. Each action validates
its `FormData` with Zod, calls the data layer, then `revalidatePath` +
`redirect`. There is no REST API for books or authors.

## Admin

Two admin surfaces, both dev-only. `src/proxy.ts` redirects `/admin/*`,
`/comp/*`, and `/api/comp/*` to `/` in production — **keep any new admin route
in that matcher**.

A Django admin used to live in `admin/` (removed 2026-08-29). It was adopted
because adding a book means editing the book-author relationship and uploading a
cover, and it was replaced because it meant running Python beside Node. Comp now
covers what it did; `git log -- admin/` still has it if a comparison is wanted.

### 1. Hand-built admin — `/admin`

`src/app/admin/` + `src/components/admin/`. AG Grid lists, forms wired to the
Server Actions above, cover upload.

One thing here is worth knowing before trusting it: the author picker computes
its own diff on the client (`added_book_authors` / `deleted_book_authors`) and
`createBookAuthor` inserts without conflict handling, against a table that has
`UNIQUE(book_id, author_id)`. Since `updateBook` returns state rather than
redirecting, the picker's state survives a save — so saving twice in one session
can re-send an author that is already linked and fail the whole update on the
constraint. Comp's widget avoids this by sending the whole membership and
diffing on the server.

### 2. Comp — `/comp`

[Comp](../vamp) is a schema-driven admin framework for TypeScript being
developed alongside this repo; managn is its first real consumer. A collection
is declared over a Drizzle table and Comp generates the list, filters, search,
forms, relation widgets, and file uploads.

- `src/lib/comp/collections.ts` — the declarations
- `src/lib/comp/cover-store.ts` — the `FileStore`: converts to WebP, writes to `public/books/`
- `src/app/api/comp/[[...slug]]/route.ts` — Comp's Hono router mounted in the App Router
- `src/components/comp/comp-admin.tsx` — `<AdminSite/>`
- `src/app/comp/comp.css` — the Comp example stylesheet, scoped under
  `.comp-admin` so its element selectors stay off the rest of the site

Three declarations are worth explaining:

- `{ collect: 'authors', field: 'name_ko' }` in `listDisplay` gathers the
  many-to-many into one cell. It is an aggregate, not a traversal — a traversal
  through a join table would list a book once per author — so it is not
  sortable, and the header does not offer an order.
- `files: [{ field: 'cover', … }]` makes `books.cover` an upload. The bytes go
  to `/api/comp/collections/books/files/cover` in their own request and the
  column stores the key that comes back, which is why a cover can be chosen on
  the add form, before the book has an id.
- `manyToMany` replaces Django's `BookAuthorInline`, which was really a
  many-to-many through `book_authors` rather than an inline over it.

#### Working on Comp from here

The `@comp/*` packages are linked from `../vamp` with pnpm `link:`. Three things
make that resolve, all of them load-bearing:

- **`next.config.ts` aliases `@comp/*` to `../vamp/packages/*/dist`.** Comp's
  package entries point at TypeScript source whose imports carry NodeNext `.js`
  specifiers, and Turbopack will not try `.ts` for those
  (`experimental.extensionAlias` is webpack-only). So **run `pnpm build` in
  `../vamp` after changing a Comp package** — the dev server reads `dist`.
- **`next.config.ts` also aliases `react`/`react-dom` to this app's copies.**
  vamp installs its own React; two copies would give `@comp/admin` a second hook
  dispatcher.
- **`tsconfig.json` pins `drizzle-orm`, `hono`, and `effect` via `paths`.**
  Without it those resolve twice, and Drizzle's `Column` has a `protected` member
  — so two structurally identical copies are still nominally different types and
  `defineCollection` fails to typecheck.

`turbopack.root` is the parent directory because the linked packages live
outside this project.
