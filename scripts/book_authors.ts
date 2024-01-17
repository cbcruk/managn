import { db } from 'db/managn'
import * as schema from 'db/schema'
import booksData from './books.json'

async function insertBookAuthor() {
  const authors = await db.select().from(schema.authors)

  for (const book of booksData
    .toSorted((a, b) => a.fields.index - b.fields.index)
    .map((book, index) => {
      return {
        authors: book.fields.authors,
        authors_ko: book.fields.authors_ko,
        index: index + 1,
      }
    })) {
    const bookAuthorIds = authors
      .filter(
        ({ name_ja, name_ko }) =>
          book.authors?.includes(name_ja || '') ||
          book.authors_ko?.includes(name_ko || '')
      )
      .map(({ id }) => id)

    for (const id of bookAuthorIds) {
      await db.insert(schema.book_authors).values({
        book_id: book.index,
        author_id: id,
      })
    }
  }
}
insertBookAuthor()
