import { defineCollection } from '@comp/core'
import { authors, book_authors, books } from '@/lib/db/schema'

/**
 * The Comp equivalent of `admin/manga/admin.py`'s `AuthorAdmin`.
 *
 * `labelField` stands in for Django's `__str__`; Comp takes a single column,
 * so a book whose author has only a Japanese name shows the empty Korean one.
 */
export const authorCollection = defineCollection({
  model: authors,
  label: '작가',
  labelPlural: '작가',
  labelField: 'name_ko',
  listDisplay: ['id', 'name_ko', 'name_ja'],
  search: ['name_ko', 'name_ja'],
  ordering: [{ field: 'id', direction: 'asc' }],
})

/**
 * The Comp equivalent of `BookAdmin`. `BookAuthorInline` is declared here as
 * what it actually is — a many-to-many through `book_authors` — rather than as
 * an inline over the join table.
 */
export const bookCollection = defineCollection({
  model: books,
  label: '책',
  labelPlural: '책',
  labelField: 'title_ko',
  // `get_authors` in `admin.py` — but as an aggregate rather than a method, so
  // the whole page costs one statement instead of one query per book.
  listDisplay: [
    'id',
    'title_ko',
    'title_ja',
    { collect: 'authors', field: 'name_ko' },
    'status',
  ],
  filters: ['status'],
  search: ['title_ko', 'title_ja', 'authors__name_ko', 'authors__name_ja'],
  ordering: [{ field: 'id', direction: 'desc' }],
  fieldsets: [
    { title: '책', fields: [['title_ko', 'title_ja'], 'link'] },
    { title: '표지 이미지', fields: ['cover'] },
    { title: '상태', fields: ['status'] },
  ],
  // The column holds the key the store returned; the bytes never touch the row.
  files: [{ field: 'cover', accept: 'image/*', maxBytes: 8 * 1024 * 1024 }],
  radioFields: ['status'],
  manyToMany: [
    { collection: 'authors', through: book_authors, filter: true },
  ],
})

export const collections = [bookCollection, authorCollection]
