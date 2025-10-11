import { BookForm } from '@/components/admin/book-form'
import { BookFormEditAction } from '@/components/admin/book-form-action'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { getBookById } from '@/lib/data'
import { Metadata } from 'next'

type Params = {
  id: string
}

type Props = {
  params: Promise<Params>
}

export const metadata = {
  title: '책 편집 | managn',
} satisfies Metadata

export default async function AdminBooksEdit({ params }: Props) {
  const { id } = await params
  const bookId = parseInt(id, 10)
  const book = await getBookById(bookId)

  return (
    <LayoutAdmin name="books">
      <BookFormEditAction>
        <input type="hidden" name="id" defaultValue={id} />
        <BookForm data={{ book }} />
      </BookFormEditAction>
    </LayoutAdmin>
  )
}
