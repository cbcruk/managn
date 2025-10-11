import { AuthorForm } from '@/components/admin/author-form'
import { AuthorFormCreateAction } from '@/components/admin/author-form-action'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { Metadata } from 'next'

export const metadata = {
  title: '작가 추가 | managn',
} satisfies Metadata

export default async function AdminAuthorsAdd() {
  return (
    <LayoutAdmin name="authors">
      <AuthorFormCreateAction>
        <AuthorForm data={{}} />
      </AuthorFormCreateAction>
    </LayoutAdmin>
  )
}
