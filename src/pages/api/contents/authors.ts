import type { APIRoute } from 'astro'
import { db } from 'db/managn'
import * as schema from 'db/schema'
import { sql } from 'drizzle-orm'
import * as fs from 'fs/promises'

export const POST: APIRoute = async () => {
  const path = './src/content/authors'
  const authorsData = await db.select().from(schema.authors)
  const booksData = await db
    .select()
    .from(schema.books)
    .where(sql`status = 'release'`)
  const bookAuthorsData = await db.select().from(schema.book_authors)

  for (const author of authorsData) {
    const books = bookAuthorsData
      .filter((a) => a.author_id === author.id)
      .map((bookAuthor) => {
        const book = booksData.find((book) => book.id === bookAuthor.book_id)

        return book?.id ? `${book?.id}` : null
      })
      .filter(Boolean)

    await fs.writeFile(
      `${path}/${author.id}.json`,
      JSON.stringify(
        {
          name_ko: author.name_ko,
          name_ja: author.name_ja,
          books,
        },
        null,
        2
      )
    )
  }

  return new Response(JSON.stringify({ message: 'SUCCESS' }), { status: 200 })
}
