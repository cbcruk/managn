import { db } from 'db/managn'
import type { Author, Book } from 'db/schema'
import * as schemas from 'db/schema'
import { BOOK_STATUS } from 'db/schema'
import { eq, getTableColumns, sql, and, inArray } from 'drizzle-orm'
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

export type BookWithCover = Book & {
  cover: string
}

export type BookWithAuthors = BookWithCover & {
  authors: Author[]
}

export type BookWithAuthorData = BookWithCover & {
  authorData: string
}

function createCoverUrl(bookId: number) {
  return `/books/${bookId}.webp`
}

function parseAuthorData(authorData: string) {
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

function parseBookData(bookData: string) {
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

function transformBookRow(book: BookWithAuthorData) {
  return {
    ...book,
    cover: createCoverUrl(book.id),
    authors: parseAuthorData(book.authorData),
  }
}

function buildBooksWithAuthorsQuery() {
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

export async function getReleasedBooks() {
  const bookRows = await buildBooksWithAuthorsQuery()
    .where(eq(schemas.books.status, BOOK_STATUS.RELEASE))
    .groupBy(schemas.books.id)

  return bookRows.map(transformBookRow)
}

export async function getReleasedBooksByAuthor(authorId: number) {
  const authorBooks = await db
    .select({ book_id: schemas.book_authors.book_id })
    .from(schemas.book_authors)
    .where(eq(schemas.book_authors.author_id, authorId))

  const bookIds = authorBooks
    .map((row) => row.book_id)
    .filter((id): id is number => id !== null)

  if (bookIds.length === 0) {
    return []
  }

  const bookRows = await buildBooksWithAuthorsQuery()
    .where(
      and(
        inArray(schemas.books.id, bookIds),
        eq(schemas.books.status, 'release')
      )
    )
    .groupBy(schemas.books.id)

  return bookRows.map(transformBookRow)
}

export async function getAuthorById(authorId: number) {
  const authors = await db
    .select()
    .from(schemas.authors)
    .where(eq(schemas.authors.id, authorId))
    .limit(1)

  return authors.at(0) || null
}

export async function getAuthorsWithBooks() {
  const authorRows = await db
    .select({
      ...getTableColumns(schemas.authors),
      bookData: sql<string>`json_group_array(
        json_object(
          'id', books.id,
          'title_ko', books.title_ko,
          'title_ja', books.title_ja,
          'status', books.status,
          'link', books.link
        )
      )`,
    })
    .from(schemas.authors)
    .leftJoin(
      schemas.book_authors,
      eq(schemas.book_authors.author_id, schemas.authors.id)
    )
    .leftJoin(schemas.books, eq(schemas.book_authors.book_id, schemas.books.id))
    .where(eq(schemas.books.status, BOOK_STATUS.RELEASE))
    .groupBy(schemas.authors.id)

  return authorRows
    .filter((author) => author.bookData && author.bookData !== NULL_VALUE)
    .map((author) => {
      return {
        ...author,
        books: parseBookData(author.bookData),
      }
    })
}

export async function getRandomBooks(count = 10) {
  const allBooks = await getReleasedBooks()

  if (allBooks.length === 0) {
    return []
  }

  const selectedBooks = new Set<BookWithAuthors>()

  while (selectedBooks.size < count && selectedBooks.size < allBooks.length) {
    const randomIndex = Math.floor(Math.random() * allBooks.length)

    selectedBooks.add(allBooks[randomIndex])
  }

  return Array.from(selectedBooks)
}

export async function getAuthors() {
  const authors = await db.select().from(schemas.authors)

  return authors
}
