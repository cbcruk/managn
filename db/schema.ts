import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey(),
  name_ko: text('name_ko').notNull(),
  name_ja: text('name_ja').notNull(),
})

export type Author = typeof authors.$inferSelect

export const insertAuthorSchema = createInsertSchema(authors)

export const selectAuthorSchema = createSelectSchema(authors)

export const books = sqliteTable('books', {
  id: integer('id').primaryKey(),
  status: text('status').notNull(),
  link: text('link'),
  title_ko: text('title_ko').notNull(),
  title_ja: text('title_ja').notNull(),
})

export type Book = typeof books.$inferSelect

export const insertBookSchema = createInsertSchema(books)

export const selectBookSchema = createSelectSchema(books)

export const book_authors = sqliteTable('book_authors', {
  book_id: integer('book_id').references(() => books.id),
  author_id: integer('author_id').references(() => authors.id),
})

export const insertBookAuthorsSchema = createInsertSchema(book_authors)
