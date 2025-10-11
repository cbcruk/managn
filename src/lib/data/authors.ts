import { db } from '../db/managn'
import type { Author } from '../db/schema'
import * as schemas from '../db/schema'
import { BOOK_STATUS } from '../db/schema'
import { eq, getTableColumns, sql, inArray } from 'drizzle-orm'
import { parseBookData } from './helpers'

const NULL_VALUE = 'null'

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

export async function getAuthors() {
  const authors = await db.select().from(schemas.authors)

  return authors
}

export async function getAuthorsByIds(ids: Array<Author['id']>) {
  const authors = await db
    .select()
    .from(schemas.authors)
    .where(inArray(schemas.authors.id, ids))

  return authors
}

export async function getAuthorsById(id: Author['id']) {
  const author = await db
    .select()
    .from(schemas.authors)
    .where(eq(schemas.authors.id, id))
    .get()

  return author
}

export async function updateAuthorData(body: Author) {
  const author = await db
    .update(schemas.authors)
    .set(body)
    .where(eq(schemas.authors.id, body.id))
    .get()

  return author
}

export async function insertAuthorData(body: Omit<Author, 'id'>) {
  const author = await db
    .insert(schemas.authors)
    .values(body)
    .returning({ id: schemas.authors.id })
    .get()

  return author
}
