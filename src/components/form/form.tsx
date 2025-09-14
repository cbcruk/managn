import { AuthorAddForm } from '@components/author-add-form/author-add-form'
import { BookAddForm } from '@components/book-add-form/book-add-form'
import { BookAuthorsForm } from '@components/book-authors-form/book-authors-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import type { BooksData, AuthorsData } from '@pages/book_authors/add.astro'

type Props = {
  data: {
    /** 도서 리스트 */
    booksData: BooksData
    /** 저자 리스트 */
    authorsData: AuthorsData
  }
}

export function Form({ data }: Props) {
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
