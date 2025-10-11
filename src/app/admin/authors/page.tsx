import { AdminAuthorsDataTable } from '@/components/admin/admin-authors-data-table'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { getAuthors } from '@/lib/data'

export default async function AdminAuthors() {
  const authors = await getAuthors()

  return (
    <LayoutAdmin name="authors">
      <AdminAuthorsDataTable data={authors} />
    </LayoutAdmin>
  )
}
