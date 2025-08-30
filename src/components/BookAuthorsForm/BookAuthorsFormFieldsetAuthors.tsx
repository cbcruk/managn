import { Label } from '@components/components/ui/label'
import { BookAuthorsFormFieldset } from './BookAuthorsFormFieldset'
import type { ComponentProps } from 'react'

function CheckboxGroup({ children }: ComponentProps<'div'>) {
  return (
    <div className="flex flex-wrap gap-2 max-h-[500px] overflow-auto">
      {children}
    </div>
  )
}

export function BookAuthorsFormFieldsetAuthors({
  children,
}: ComponentProps<typeof BookAuthorsFormFieldset.Body>) {
  return (
    <BookAuthorsFormFieldset
      role="group"
      aria-labelledby="작가-group-heading"
      className="text-neutral-100"
    >
      <BookAuthorsFormFieldset.Label id="작가-group-heading">
        <Label>작가</Label>
      </BookAuthorsFormFieldset.Label>
      <BookAuthorsFormFieldset.Body>{children}</BookAuthorsFormFieldset.Body>
    </BookAuthorsFormFieldset>
  )
}

BookAuthorsFormFieldsetAuthors.CheckboxGroup = CheckboxGroup
