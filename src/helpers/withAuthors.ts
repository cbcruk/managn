import { getEntries } from 'astro:content'
import type { BookEntry } from '../content/config'

export async function withAuthors(book: BookEntry) {
  const authorEntries = await getEntries(book.data.authors)

  return {
    ...book,
    ref: {
      authors: authorEntries,
    },
  }
}
