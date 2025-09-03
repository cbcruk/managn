import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db } from 'db/managn'
import * as schema from 'db/schema'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import fs from 'node:fs/promises'

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
  book: defineAction({
    accept: 'form',
    input: z.object({
      title_ko: z.string(),
      title_ja: z.string(),
      status: z.string(),
      link: z.string(),
      cover: z.instanceof(File),
    }),
    handler: async ({ title_ko, title_ja, status, link, cover }) => {
      const result = await db
        .insert(schema.books)
        .values({
          title_ko: title_ko,
          title_ja: title_ja,
          status: status,
          link: link,
        })
        .returning({
          id: schema.books.id,
        })

      const bookId = result.at(0)?.id

      if (bookId && cover && cover.size > 0) {
        try {
          const arrayBuffer = await cover.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const result = await imagemin.buffer(
            buffer as unknown as Uint8Array,
            {
              plugins: [
                imageminWebp({
                  quality: 80,
                }),
              ],
            }
          )

          await fs.writeFile(`public/books/${bookId}.webp`, result)
        } catch (error) {
          console.error('ERROR', error)
        }
      }

      return true
    },
  }),
  author: defineAction({
    accept: 'form',
    input: z.object({
      name_ko: z.string(),
      name_ja: z.string(),
    }),
    async handler({ name_ko, name_ja }) {
      await db.insert(schema.authors).values({
        name_ko,
        name_ja,
      })

      return true
    },
  }),
}
