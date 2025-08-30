import type { AuthorsData, BooksData } from '@pages/form.astro'
import { ErrorBoundary } from 'react-error-boundary'
import { BookAuthorsFormAction } from './BookAuthorsFormAction'
import { BookAuthorsFormAlert } from './BookAuthorsFormAlert'
import { BookAuthorsFormLayout } from './BookAuthorsFormLayout'
import { BookAuthorsFormFieldsetBook } from './BookAuthorsFormFieldsetBook'
import { BookAuthorsFormFieldsetAuthors } from './BookAuthorsFormFieldsetAuthors'
import {
  generateAuthorOptions,
  generateBookOptions,
} from './BookAuthorsFormFieldsetBook.helpers'
import { BookAuthorsFormCheckbox } from './BookAuthorsFormCheckbox'
import { Button } from '@components/components/ui/button'

type Props = {
  data: {
    /** 도서 리스트 */
    booksData: BooksData
    /** 저자 리스트 */
    authorsData: AuthorsData
  }
}

export function BookAuthorsForm({ data }: Props) {
  return (
    <ErrorBoundary FallbackComponent={BookAuthorsFormAlert}>
      <BookAuthorsFormAction>
        {({ pending }) => {
          return (
            <BookAuthorsFormLayout>
              <BookAuthorsFormLayout.Title>책-작가</BookAuthorsFormLayout.Title>

              <BookAuthorsFormLayout.FieldsetGroup>
                <BookAuthorsFormFieldsetBook>
                  <BookAuthorsFormFieldsetBook.Input
                    id="book"
                    name="book"
                    list="datalist-book"
                    className="text-sm"
                  />
                  <BookAuthorsFormFieldsetBook.Datalist>
                    {generateBookOptions(data.booksData).map((book) => (
                      <option
                        key={book.id}
                        value={book.id}
                        label={book.label}
                      />
                    ))}
                  </BookAuthorsFormFieldsetBook.Datalist>
                </BookAuthorsFormFieldsetBook>

                <BookAuthorsFormFieldsetAuthors>
                  <BookAuthorsFormFieldsetAuthors.CheckboxGroup>
                    {generateAuthorOptions(data.authorsData).map((author) => (
                      <BookAuthorsFormCheckbox
                        key={author.id}
                        value={author.id}
                      >
                        {author.label}
                      </BookAuthorsFormCheckbox>
                    ))}
                  </BookAuthorsFormFieldsetAuthors.CheckboxGroup>
                </BookAuthorsFormFieldsetAuthors>
              </BookAuthorsFormLayout.FieldsetGroup>

              <BookAuthorsFormLayout.Footer>
                <Button type="submit" disabled={pending} className="flex-1">
                  저장
                </Button>
              </BookAuthorsFormLayout.Footer>
            </BookAuthorsFormLayout>
          )
        }}
      </BookAuthorsFormAction>
    </ErrorBoundary>
  )
}
