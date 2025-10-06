import { AuthorAddForm } from '@components/admin/author-add-form'
import { BookAddForm } from '@components/admin/book-add-form'
import { BookAuthorsForm } from '@components/book-authors-form/book-authors-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'

export function Form({ data }) {
  return (
    <Tabs defaultValue="book" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="book">책</TabsTrigger>
        <TabsTrigger value="author">작가</TabsTrigger>
        <TabsTrigger value="book_authors">책-작가</TabsTrigger>
      </TabsList>
      <div className="p-2">
        <TabsContent value="book">
          <BookAddForm />
        </TabsContent>
        <TabsContent value="author">
          <AuthorAddForm />
        </TabsContent>
        <TabsContent value="book_authors">
          <BookAuthorsForm data={data} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
