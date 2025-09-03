import { db } from 'db/managn'
import type { Author, Book } from 'db/schema'
import * as schemas from 'db/schema'
import { eq, getTableColumns, sql, and, inArray } from 'drizzle-orm'

export type BookWithCover = Book & {
  cover: string
}

export type BookWithAuthors = BookWithCover & {
  authors: Author[]
}

export type BookWithAuthorData = BookWithCover & {
  authorData: string
}

export type AuthorWithBooks = Author & {
  books: BookWithCover[]
}

function createCoverUrl(bookId: number) {
  return `/src/content/books/assets/${bookId}.webp`
}

function parseAuthorData(authorData: string) {
  return authorData
    .split('|')
    .filter(Boolean)
    .map((author) => {
      const [id, name_ko, name_ja] = author.split(':')

      return {
        id: parseInt(id, 10),
        name_ko,
        name_ja,
      }
    })
}

function parseBookData(bookData: string) {
  return bookData
    .split('|')
    .filter((str) => str && str !== 'null:null:null:null:null')
    .map((bookStr) => {
      const [id, title_ko, title_ja, status, link] = bookStr.split(':')

      return {
        id: parseInt(id, 10),
        title_ko,
        title_ja,
        status: status as 'release' | 'draft',
        link: link || null,
        cover: createCoverUrl(parseInt(id, 10)),
      }
    })
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
      authorData: sql<string>`GROUP_CONCAT(authors.id || ':' || authors.name_ko || ':' || authors.name_ja, '|')`,
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
    .where(eq(schemas.books.status, 'release'))
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
    .map((id) => id ?? [])
    .flat()

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
      bookData: sql<string>`GROUP_CONCAT(books.id || ':' || books.title_ko || ':' || books.title_ja || ':' || books.status || ':' || books.link, '|')`,
    })
    .from(schemas.authors)
    .leftJoin(
      schemas.book_authors,
      eq(schemas.book_authors.author_id, schemas.authors.id)
    )
    .leftJoin(schemas.books, eq(schemas.book_authors.book_id, schemas.books.id))
    .where(eq(schemas.books.status, 'release'))
    .groupBy(schemas.authors.id)

  return authorRows
    .filter(
      (author) =>
        author.bookData && author.bookData !== 'null:null:null:null:null'
    )
    .map((author) => ({
      ...author,
      books: parseBookData(author.bookData),
    }))
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
