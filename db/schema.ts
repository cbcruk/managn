import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey(),
  name_ko: text('name_ko').notNull(),
  name_ja: text('name_ja').notNull(),
})

export const books = sqliteTable('books', {
  id: integer('id').primaryKey(),
  status: text('status').notNull(),
  link: text('link'),
  title_ko: text('title_ko').notNull(),
  title_ja: text('title_ja').notNull(),
})

export const book_authors = sqliteTable('book_authors', {
  book_id: integer('book_id').notNull(),
  author_id: integer('author_id').notNull(),
})
