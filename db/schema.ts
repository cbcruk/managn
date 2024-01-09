import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey(),
  name_ko: text('name_ko'),
  name_ja: text('name_ja'),
})

export const books = sqliteTable('books', {
  id: integer('id').primaryKey(),
  status: text('status'),
  link: text('link'),
  title_ko: text('title_ko'),
  title_ja: text('title_ja'),
})

export const book_authors = sqliteTable('book_authors', {
  book_id: integer('book_id'),
  author_id: integer('author_id'),
})
