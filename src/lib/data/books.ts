import { db } from '../db/managn'
import type { Book, BookAuthor } from '../db/schema'
import * as schemas from '../db/schema'
import { BOOK_STATUS } from '../db/schema'
import { eq, sql, and, inArray, desc } from 'drizzle-orm'
import type { BookWithAuthors, Pagination } from './types'
import {
  buildBooksWithAuthorsQuery,
  createCoverUrl,
  parseAuthorData,
} from './helpers'

export async function getReleasedBooks() {
  const bookRows = await buildBooksWithAuthorsQuery()
    .where(eq(schemas.books.status, BOOK_STATUS.RELEASE))
    .groupBy(schemas.books.id)

  return bookRows.map((book) => {
    return {
      ...book,
      cover: createCoverUrl(book.id),
      authors: parseAuthorData(book.authorData),
    }
  })
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

  return bookRows.map((book) => {
    return {
      ...book,
      cover: createCoverUrl(book.id),
      authors: parseAuthorData(book.authorData),
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

export async function getReleasedBooksByPageSize(
  page: number = 1,
  pageSize: number = 20
) {
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schemas.books)
    .where(eq(schemas.books.status, BOOK_STATUS.RELEASE))
    .get()
  const totalCount = totalCountResult?.count || 0

  if (totalCount === 0) {
    return {
      books: [],
      pagination: {
        currentPage: page,
        pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      } satisfies Pagination,
    }
  }

  const offset = (page - 1) * pageSize
  const bookRows = await buildBooksWithAuthorsQuery()
    .where(eq(schemas.books.status, BOOK_STATUS.RELEASE))
    .groupBy(schemas.books.id)
    .orderBy(desc(schemas.books.id))
    .limit(pageSize)
    .offset(offset)

  const books = bookRows.map((book) => ({
    ...book,
    cover: createCoverUrl(book.id),
    authors: parseAuthorData(book.authorData),
  }))

  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    books,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    } satisfies Pagination,
  }
}

export async function getBooks() {
  const books = await db
    .select()
    .from(schemas.books)
    .orderBy(desc(schemas.books.id))

  return books
}

export async function getBookById(id: Book['id']) {
  const book = await db
    .select()
    .from(schemas.books)
    .where(eq(schemas.books.id, id))
    .get()

  return book
}

export async function getBookAuthorsByBookId(bookId: Book['id']) {
  const bookAuthors = await db
    .select()
    .from(schemas.book_authors)
    .where(eq(schemas.book_authors.book_id, bookId))

  return bookAuthors
}

export async function updateBookData(
  body: Partial<Book> & {
    id: Book['id']
  }
) {
  const book = await db
    .update(schemas.books)
    .set(body)
    .where(eq(schemas.books.id, body.id))
    .returning({
      id: schemas.books.id,
    })
    .get()

  return book
}

export async function insertBook(body: {
  title_ko: string
  title_ja: string
  status: string
  link?: string
}) {
  const book = await db
    .insert(schemas.books)
    .values(body)
    .returning({
      id: schemas.books.id,
    })
    .get()

  return book
}

export async function createBookAuthor(body: BookAuthor) {
  await db.insert(schemas.book_authors).values(body)
}

export async function deleteBookAuthor(body: BookAuthor) {
  if (!body.book_id) return
  if (!body.author_id) return

  await db
    .delete(schemas.book_authors)
    .where(
      and(
        eq(schemas.book_authors.book_id, body.book_id),
        eq(schemas.book_authors.author_id, body.author_id)
      )
    )
}
