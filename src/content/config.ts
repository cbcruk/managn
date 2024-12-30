import {
  defineCollection,
  reference,
  z,
  type CollectionEntry,
} from 'astro:content'
import { db } from 'db/managn'
import * as schemas from 'db/schema'
import { and, eq, getTableColumns, sql } from 'drizzle-orm'

const books = defineCollection({
  async loader() {
    const bookRows = await db
      .select({
        ...getTableColumns(schemas.books),
        authors: sql<string>`GROUP_CONCAT(authors.id)`,
      })
      .from(schemas.books)
      .leftJoin(
        schemas.book_authors,
        eq(schemas.books.id, schemas.book_authors.book_id)
      )
      .leftJoin(
        schemas.authors,
        eq(schemas.book_authors.author_id, schemas.authors.id)
      )
      .where(eq(schemas.books.status, 'release'))
      .groupBy(schemas.books.id)

    const result = bookRows.map((book) => {
      const cover = new URL(`./books/assets/${book.id}.webp`, import.meta.url)

      return {
        ...book,
        id: `${book.id}`,
        authors: book.authors.split(','),
        cover: cover.pathname,
      }
    })

    return result
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
    const authorRows = await db
      .select({
        ...getTableColumns(schemas.authors),
        books: sql<string>`GROUP_CONCAT(books.id)`,
      })
      .from(schemas.authors)
      .leftJoin(
        schemas.book_authors,
        eq(schemas.book_authors.author_id, schemas.authors.id)
      )
      .leftJoin(
        schemas.books,
        eq(schemas.book_authors.book_id, schemas.books.id)
      )
      .where(eq(schemas.books.status, 'release'))
      .groupBy(schemas.authors.id)
    const result = authorRows.map((author) => {
      return {
        ...author,
        id: `${author.id}`,
        books: author.books.split(','),
      }
    })

    return result
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
