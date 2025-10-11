import { Books } from '@/components/books'
import { LayoutDefault } from '@/components/layout/layout-default'
import { getAuthorById, getReleasedBooksByAuthor } from '@/lib/data'
import { Metadata } from 'next'
import { cache } from 'react'

type Id = string

type Params = {
  id: Id
}

type Props = {
  params: Promise<Params>
}

const cachedAuthorId = cache((id: Id) => parseInt(id, 10))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const authorId = cachedAuthorId((await params).id)
  const authorData = await getAuthorById(authorId)

  return {
    title: `${authorData?.name_ko}: 책들 | managn`,
  }
}

export default async function AuthorId({ params }: Props) {
  const authorId = cachedAuthorId((await params).id)
  const books = await getReleasedBooksByAuthor(authorId)

  return (
    <LayoutDefault>
      <Books data={books} />
    </LayoutDefault>
  )
}
