import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db } from 'db/managn'
import * as schema from 'db/schema'

export const server = {
  bookAuthors: defineAction({
    accept: 'form',
    input: z.object({
      book: z.string(),
      authors: z.array(z.string()),
    }),
    handler: async ({ book, authors }) => {
      for (const author of authors) {
        await db.insert(schema.book_authors).values({
          book_id: parseInt(book, 10),
          author_id: parseInt(author, 10),
        })
      }

      return true
    },
  }),
}
