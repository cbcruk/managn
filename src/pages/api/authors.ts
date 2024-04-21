import type { APIRoute } from 'astro'
import { db } from 'db/managn'
import * as schema from 'db/schema'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()
  const author = schema.insertAuthorSchema.parse(data)

  const result = await db.insert(schema.authors).values({
    name_ko: author.name_ko,
    name_ja: author.name_ja,
  })

  return new Response(JSON.stringify(result), { status: 200 })
}

export const GET: APIRoute = async () => {
  const authorsData = await db.select().from(schema.authors)

  return new Response(JSON.stringify(authorsData), { status: 200 })
}
