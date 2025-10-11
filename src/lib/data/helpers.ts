import { db } from '../db/managn'
import * as schemas from '../db/schema'
import { BOOK_STATUS } from '../db/schema'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { z } from 'zod'

const NULL_VALUE = 'null'

const authorParseSchema = z.object({
  id: z.coerce.number(),
  name_ko: z.string().default(''),
  name_ja: z.string().default(''),
})

const bookFromJsonSchema = z.object({
  id: z.coerce.number(),
  title_ko: z.string().default(''),
  title_ja: z.string().default(''),
  status: z
    .enum([BOOK_STATUS.RELEASE, BOOK_STATUS.DRAFT])
    .default(BOOK_STATUS.DRAFT),
  link: z
    .string()
    .nullable()
    .transform((link) => (link === NULL_VALUE ? null : link)),
})

export function createCoverUrl(bookId: number) {
  return `/books/${bookId}.webp`
}

export function parseAuthorData(authorData: string) {
  if (!authorData?.trim() || authorData === NULL_VALUE) {
    return []
  }

  try {
    const authors = JSON.parse(authorData)
    if (!Array.isArray(authors)) {
      return []
    }

    return authors
      .map((author) => authorParseSchema.safeParse(author))
      .filter((result) => result.success)
      .map((result) => result.data)
  } catch {
    return []
  }
}

export function parseBookData(bookData: string) {
  if (!bookData?.trim() || bookData === NULL_VALUE) {
    return []
  }

  try {
    const books = JSON.parse(bookData)
    if (!Array.isArray(books)) {
      return []
    }

    return books
      .map((book) => bookFromJsonSchema.safeParse(book))
      .filter((result) => result.success)
      .map((result) => ({
        ...result.data,
        cover: createCoverUrl(result.data.id),
      }))
  } catch {
    return []
  }
}

export function buildBooksWithAuthorsQuery() {
  return db
    .select({
      ...getTableColumns(schemas.books),
      authorData: sql<string>`json_group_array(
        json_object(
          'id', authors.id,
          'name_ko', authors.name_ko,
          'name_ja', authors.name_ja
        )
      )`,
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
}
