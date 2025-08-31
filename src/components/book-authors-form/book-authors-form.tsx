import type { AuthorsData, BooksData } from '@pages/book_authors/add.astro'
import { ErrorBoundary } from 'react-error-boundary'
import { BookAuthorsFormAction } from './book-authors-form-action'
import { BookAuthorsFormFieldsetBook } from './book-authors-form-fieldset-book'
import { BookAuthorsFormFieldsetAuthors } from './book-authors-form-fieldset-authors'
import {
  generateAuthorOptions,
  generateBookOptions,
} from './book-authors-form-fieldset-book.helpers'
import { BookAuthorsFormCheckbox } from './book-authors-form-checkbox'
import { Button } from '@components/ui/button'
import { FormLayout } from '@components/form/form-layout'
import { FormAlert } from '@components/form/form-alert'

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
    <ErrorBoundary FallbackComponent={FormAlert}>
      <BookAuthorsFormAction>
        {({ pending }) => {
          return (
            <FormLayout>
              <FormLayout.Title>책-작가</FormLayout.Title>

              <FormLayout.FieldGroup>
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
              </FormLayout.FieldGroup>

              <FormLayout.Footer>
                <Button type="submit" disabled={pending} className="flex-1">
                  저장
                </Button>
              </FormLayout.Footer>
            </FormLayout>
          )
        }}
      </BookAuthorsFormAction>
    </ErrorBoundary>
  )
}
