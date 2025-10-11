import { Books } from '@/components/books'
import { LayoutDefault } from '@/components/layout/layout-default'
import {
  Nav,
  NavButtonGroup,
  NavNextButton,
  NavPrevButton,
  NavStatus,
} from '@/components/nav'
import { getReleasedBooksByPageSize } from '@/lib/data'
import { Metadata } from 'next'

type Params = {
  page: string
}

type Props = {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params

  return {
    title: `만화 리스트 - ${page}페이지 | managn`,
  }
}

export default async function BooksPage({ params }: Props) {
  const page = parseInt((await params).page)
  const { books, pagination } = await getReleasedBooksByPageSize(page)

  return (
    <LayoutDefault>
      <Books data={books} />
      <Nav>
        <NavStatus
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
        />
        <NavButtonGroup>
          {pagination.hasPreviousPage && (
            <NavPrevButton href={`/books/${pagination.currentPage - 1}`} />
          )}
          {pagination.hasNextPage && (
            <NavNextButton href={`/books/${pagination.currentPage + 1}`} />
          )}
        </NavButtonGroup>
      </Nav>
    </LayoutDefault>
  )
}
