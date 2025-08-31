import type { AuthorsData, BooksData } from '@pages/book_authors/add.astro'

export function generateBookOptions(data: BooksData) {
  return data
    .toSorted((a, b) => a.title_ko.localeCompare(b.title_ko))
    .map((book) => ({
      id: book.id,
      label: book.title_ko || book.title_ja,
    }))
}

export function generateAuthorOptions(data: AuthorsData) {
  return data
    .toSorted((a, b) => a.name_ko.localeCompare(b.name_ko))
    .map((author) => ({
      id: author.id,
      label: author.name_ko || author.name_ja,
    }))
}
