import { column, defineDb, defineTable } from 'astro:db'

const Authors = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name_ko: column.text(),
    name_ja: column.text(),
  },
})

const BookAuthors = defineTable({
  columns: {
    book_id: column.number({ references: () => Books.columns.id }),
    author_id: column.number({ references: () => Authors.columns.id }),
  },
})

const Books = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    status: column.text(),
    link: column.text(),
    title_ko: column.text(),
    title_ja: column.text(),
  },
})

export default defineDb({
  tables: {
    Authors,
    BookAuthors,
  },
})
