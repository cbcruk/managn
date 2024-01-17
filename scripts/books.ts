import * as fs from 'fs/promises'
import { db } from 'db/managn'
import * as schema from 'db/schema'
import { sql } from 'drizzle-orm'
import booksData from './books.json'

async function insert() {
  const books = booksData.filter((book) => book.fields.status === 'release')

  for (const book of books) {
    await db.insert(schema.books).values({
      status: book.fields.status,
      link: book.fields.link,
      title_ko: book.fields.title_ko,
      title_ja: book.fields.title,
    })
  }
}

async function downloadImage() {
  const mime = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png',
  }
  const path = `${import.meta.dir}/assets`
  const books = booksData.filter((book) => book.fields.status === 'release')

  for (const book of books) {
    const attachment = book.fields.attachments?.[0]

    if (attachment) {
      const response = await fetch(attachment.url, {
        headers: {
          'Content-Type': attachment.type,
        },
      })
      const extension = mime[attachment.type]
      const blob = await response.blob()
      const data = new DataView(await blob.arrayBuffer())

      await fs.writeFile(`${path}/${book.fields.index}.${extension}`, data)
    }
  }
}

async function toJSON() {
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
}
toJSON()
