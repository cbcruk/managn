import type { ComponentProps } from 'react'
import { BookAuthorsFormFieldset } from './BookAuthorsFormFieldset'

function Datalist({ children }: ComponentProps<'datalist'>) {
  return <datalist id="datalist-book">{children}</datalist>
}

function Input() {
  return (
    <input
      type="text"
      id="book"
      name="book"
      list="datalist-book"
      className="h-6 p-2 rounded-md text-xs"
    />
  )
}

export function BookAuthorsFormFieldsetBook({
  children,
}: ComponentProps<typeof BookAuthorsFormFieldset.Body>) {
  return (
    <BookAuthorsFormFieldset>
      <BookAuthorsFormFieldset.Label className="text-neutral-100">
        <label htmlFor="book">책</label>
      </BookAuthorsFormFieldset.Label>
      <BookAuthorsFormFieldset.Body>{children}</BookAuthorsFormFieldset.Body>
    </BookAuthorsFormFieldset>
  )
}

BookAuthorsFormFieldsetBook.Input = Input
BookAuthorsFormFieldsetBook.Datalist = Datalist
