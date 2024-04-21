import type { APIRoute } from 'astro'
import { db } from 'db/managn'
import * as schema from 'db/schema'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const book = schema.insertBookSchema.parse(data)
  const result = await db.insert(schema.books).values({
    status: book.status,
    link: book.link,
    title_ko: book.title_ko,
    title_ja: book.title_ja,
  })

  return new Response(JSON.stringify(result), { status: 200 })
}
