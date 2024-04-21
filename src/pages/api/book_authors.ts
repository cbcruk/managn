import type { APIRoute } from 'astro'
import { db } from 'db/managn'
import * as schema from 'db/schema'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const bookAuthors = schema.insertBookAuthorsSchema.parse(data)

  const result = await db.insert(schema.book_authors).values({
    book_id: bookAuthors.book_id,
    author_id: bookAuthors.author_id,
  })

  console.log(JSON.stringify(bookAuthors))

  return new Response(JSON.stringify(result), { status: 200 })
}
