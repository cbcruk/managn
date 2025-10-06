import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { db } from 'db/managn'
import * as schema from 'db/schema'
import { eq } from 'drizzle-orm'
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
      id: z.string().optional(),
      title_ko: z.string(),
      title_ja: z.string(),
      status: z.string(),
      link: z.string().optional(),
      cover: z.instanceof(File).optional(),
    }),
    handler: async ({ id, title_ko, title_ja, status, link, cover }) => {
      let bookId: number

      if (id) {
        bookId = parseInt(id, 10)

        await db
          .update(schema.books)
          .set({
            title_ko,
            title_ja,
            status,
            link,
          })
          .where(eq(schema.books.id, bookId))
      } else {
        const result = await db
          .insert(schema.books)
          .values({
            title_ko,
            title_ja,
            status,
            link,
          })
          .returning({
            id: schema.books.id,
          })

        bookId = result.at(0)?.id!
      }

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
  deleteBook: defineAction({
    accept: 'form',
    input: z.object({
      id: z.string(),
    }),
    handler: async ({ id }) => {
      const bookId = parseInt(id, 10)

      await db
        .delete(schema.book_authors)
        .where(eq(schema.book_authors.book_id, bookId))

      await db.delete(schema.books).where(eq(schema.books.id, bookId))

      try {
        await fs.unlink(`public/books/${bookId}.webp`)
      } catch (error) {
        console.warn(`실패 ${bookId}:`, error)
      }

      return true
    },
  }),
  author: defineAction({
    accept: 'form',
    input: z.object({
      id: z.string().optional(),
      name_ko: z.string(),
      name_ja: z.string(),
    }),
    async handler({ id, name_ko, name_ja }) {
      if (id) {
        const authorId = parseInt(id, 10)
        await db
          .update(schema.authors)
          .set({
            name_ko,
            name_ja,
          })
          .where(eq(schema.authors.id, authorId))
      } else {
        await db.insert(schema.authors).values({
          name_ko,
          name_ja,
        })
      }

      return true
    },
  }),
}
