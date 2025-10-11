import { BookForm } from '@/components/admin/book-form'
import { BookFormCreateAction } from '@/components/admin/book-form-action'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { Metadata } from 'next'

export const metadata = {
  title: '책 추가 | managn',
} satisfies Metadata

export default async function AdminBooksAdd() {
  return (
    <LayoutAdmin name="books">
      <BookFormCreateAction>
        <BookForm data={{}} />
      </BookFormCreateAction>
    </LayoutAdmin>
  )
}
