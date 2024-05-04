import * as fs from 'fs/promises'
import { db } from 'db/managn'
import * as schema from 'db/schema'
import { sql } from 'drizzle-orm'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async () => {
  const path = './src/content/books'
  const authorsData = await db.select().from(schema.authors)
  const booksData = await db
    .select()
    .from(schema.books)
    .where(sql`status = 'release'`)
  const bookAuthorsData = await db.select().from(schema.book_authors)

  for (const book of booksData) {
    const authorIds = bookAuthorsData
      .filter((bookAuthor) => bookAuthor.book_id === book.id)
      .map((bookAuthor) => bookAuthor.author_id)
    const authors = authorsData.filter((author) =>
      authorIds.includes(author.id)
    )

    await fs.writeFile(
      `${path}/${book.id}.json`,
      JSON.stringify(
        {
          id: book.id,
          status: book.status,
          link: book.link,
          title_ko: book.title_ko,
          title_ja: book.title_ja,
          authors,
          cover: `./assets/${book.id}.webp`,
        },
        null,
        2
      )
    )
  }

  return new Response(JSON.stringify({ message: 'SUCCESS' }), { status: 200 })
}
