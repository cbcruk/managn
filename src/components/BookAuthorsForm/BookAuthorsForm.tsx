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
                  <BookAuthorsFormFieldsetBook.Input />
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
                <button
                  type="submit"
                  className="flex-1 rounded-lg p-1 bg-red-200 text-xs"
                  disabled={pending}
                >
                  저장
                </button>
              </BookAuthorsFormLayout.Footer>
            </BookAuthorsFormLayout>
          )
        }}
      </BookAuthorsFormAction>
    </ErrorBoundary>
  )
}
