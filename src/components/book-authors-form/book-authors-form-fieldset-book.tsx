import type { ComponentProps } from 'react'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { FormLayoutField } from '@components/form/form-layout'

function Datalist({ children }: ComponentProps<'datalist'>) {
  return <datalist id="datalist-book">{children}</datalist>
}

export function BookAuthorsFormFieldsetBook({
  children,
}: ComponentProps<typeof FormLayoutField.Body>) {
  return (
    <FormLayoutField>
      <FormLayoutField.Label>
        <Label htmlFor="book">책</Label>
      </FormLayoutField.Label>
      <FormLayoutField.Body>{children}</FormLayoutField.Body>
    </FormLayoutField>
  )
}

BookAuthorsFormFieldsetBook.Input = Input
BookAuthorsFormFieldsetBook.Datalist = Datalist
