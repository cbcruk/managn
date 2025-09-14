import type { Author, Book } from 'db/schema'

export type BookAuthorsFormProps = {
  data: {
    /** 도서 리스트 */
    booksData: Book[]
    /** 저자 리스트 */
    authorsData: Author[]
  }
}
