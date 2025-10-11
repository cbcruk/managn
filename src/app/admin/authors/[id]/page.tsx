import { AuthorForm } from '@/components/admin/author-form'
import { AuthorFormEditAction } from '@/components/admin/author-form-action'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { getAuthorsById } from '@/lib/data'
import { Metadata } from 'next'

type Params = {
  id: string
}

type Props = {
  params: Promise<Params>
}

export const metadata = {
  title: '작가 편집 | managn',
} satisfies Metadata

export default async function AdminAuthorsEdit({ params }: Props) {
  const { id } = await params
  const authorId = parseInt(id, 10)
  const author = await getAuthorsById(authorId)

  return (
    <LayoutAdmin name="authors">
      <AuthorFormEditAction>
        <input type="hidden" name="id" defaultValue={id} />
        <AuthorForm data={{ author }} />
      </AuthorFormEditAction>
    </LayoutAdmin>
  )
}
