import { db, Authors, Books, BookAuthors } from 'astro:db'
import * as schema from 'db/schema'
import { db as sqlite } from 'db/managn'

export default async function main() {
  const authorsData = await sqlite.select().from(schema.authors)
  const booksData = await sqlite.select().from(schema.books)
  const bookAuthorsData = await sqlite.select().from(schema.book_authors)

  await db.insert(Authors).values(authorsData)
  await db.insert(Books).values(
    booksData.map((book) => {
      return {
        ...book,
        link: book.link ?? '',
      }
    })
  )
  await db.insert(BookAuthors).values(bookAuthorsData)
}
