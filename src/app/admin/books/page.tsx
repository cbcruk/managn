import { AdminBooksDataTable } from '@/components/admin/admin-books-data-table'
import { LayoutAdmin } from '@/components/layout/layout-admin'
import { getBooks } from '@/lib/data'

export default async function AdminBooks() {
  const books = await getBooks()

  return (
    <LayoutAdmin name="books">
      <AdminBooksDataTable data={books} />
    </LayoutAdmin>
  )
}
