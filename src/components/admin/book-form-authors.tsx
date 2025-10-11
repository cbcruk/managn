import { getAuthors, getBookAuthorsByBookId } from '@/lib/data'
import { Book } from '@/lib/db/schema'
import { BookFormAuthorsClient } from './book-form-authors.client'

type BookFormAuthorsProps = {
  id?: Book['id']
}

async function getAuthorIds(id: BookFormAuthorsProps['id']) {
  if (!id) {
    return []
  }

  const bookAuthors = await getBookAuthorsByBookId(id)
  const authorIds = bookAuthors
    .map((bookAuthor) => bookAuthor.author_id || [])
    .flat()

  return authorIds
}

export async function BookFormAuthors({ id }: BookFormAuthorsProps) {
  const authors = await getAuthors()
  const authorIds = await getAuthorIds(id)

  return <BookFormAuthorsClient authors={authors} defaultSelected={authorIds} />
}
