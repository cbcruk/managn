import { Label } from '@components/ui/label'
import type { ComponentProps } from 'react'
import { FormLayoutField } from '@components/form/form-layout'

function CheckboxGroup({ children }: ComponentProps<'div'>) {
  return (
    <div className="flex flex-wrap gap-2 max-h-[500px] overflow-auto">
      {children}
    </div>
  )
}

export function BookAuthorsFormFieldsetAuthors({
  children,
}: ComponentProps<typeof FormLayoutField.Body>) {
  return (
    <FormLayoutField
      role="group"
      aria-labelledby="작가-group-heading"
      className="flex flex-col gap-4 text-neutral-100"
    >
      <FormLayoutField.Label id="작가-group-heading">
        <Label>작가</Label>
      </FormLayoutField.Label>
      <FormLayoutField.Body>{children}</FormLayoutField.Body>
    </FormLayoutField>
  )
}

BookAuthorsFormFieldsetAuthors.CheckboxGroup = CheckboxGroup
