import type { ComponentProps } from 'react'
import { BookAuthorsFormFieldset } from './BookAuthorsFormFieldset'
import { Input } from '@components/components/ui/input'
import { Label } from '@components/components/ui/label'

function Datalist({ children }: ComponentProps<'datalist'>) {
  return <datalist id="datalist-book">{children}</datalist>
}

export function BookAuthorsFormFieldsetBook({
  children,
}: ComponentProps<typeof BookAuthorsFormFieldset.Body>) {
  return (
    <BookAuthorsFormFieldset>
      <BookAuthorsFormFieldset.Label className="text-neutral-100">
        <Label htmlFor="book">책</Label>
      </BookAuthorsFormFieldset.Label>
      <BookAuthorsFormFieldset.Body>{children}</BookAuthorsFormFieldset.Body>
    </BookAuthorsFormFieldset>
  )
}

BookAuthorsFormFieldsetBook.Input = Input
BookAuthorsFormFieldsetBook.Datalist = Datalist
