import type { BookAuthorsFormProps } from './book-authors-form.types'

export function generateBookOptions(
  data: BookAuthorsFormProps['data']['booksData']
) {
  return data
    .toSorted((a, b) => a.title_ko.localeCompare(b.title_ko))
    .map((book) => ({
      id: book.id,
      label: book.title_ko || book.title_ja,
    }))
}

export function generateAuthorOptions(
  data: BookAuthorsFormProps['data']['authorsData']
) {
  return data
    .toSorted((a, b) => a.name_ko.localeCompare(b.name_ko))
    .map((author) => ({
      id: author.id,
      label: author.name_ko || author.name_ja,
    }))
}
