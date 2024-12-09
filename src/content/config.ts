import {
  defineCollection,
  reference,
  z,
  type CollectionEntry,
} from 'astro:content'
import { db } from 'db/managn'
import * as schemas from 'db/schema'

const books = defineCollection({
  async loader() {
    const bookAuthorRows = await db.select().from(schemas.book_authors)
    const bookRows = await db.select().from(schemas.books)

    return bookRows.map((book) => {
      const cover = new URL(`./books/assets/${book.id}.webp`, import.meta.url)

      return {
        ...book,
        id: `${book.id}`,
        authors: bookAuthorRows
          .filter(({ book_id }) => book.id === book_id)
          .map(({ author_id }) => `${author_id}`),
        cover: cover.pathname,
      }
    })
  },
  schema: ({ image }) =>
    z.object({
      status: z.enum(['release', 'draft']),
      link: z.string().nullable(),
      title_ja: z.string().nullable(),
      title_ko: z.string().nullable(),
      authors: z.array(reference('authors')),
      cover: image().nullable(),
    }),
})

const authors = defineCollection({
  async loader() {
    const bookAuthorRows = await db.select().from(schemas.book_authors)
    const authorRows = await db.select().from(schemas.authors)

    return authorRows.map((author) => {
      return {
        ...author,
        id: `${author.id}`,
        books: bookAuthorRows
          .filter(({ author_id }) => author.id === author_id)
          .map(({ book_id }) => `${book_id}`),
      }
    })
  },
  schema: z.object({
    name_ko: z.string().nullable(),
    name_ja: z.string().nullable(),
    books: z.array(reference('books')),
  }),
})

export const collections = {
  books,
  authors,
}

export type BookEntry = CollectionEntry<'books'>

export type AuthorEntry = CollectionEntry<'authors'>

export type BookWithAuthors = BookEntry & {
  ref: {
    authors: AuthorEntry[]
  }
}
