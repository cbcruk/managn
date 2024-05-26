import type { ComponentProps, Fragment } from 'react'
import { twc } from 'react-twc'

type Props = ComponentProps<'fieldset'>

function Body({ children }: ComponentProps<typeof Fragment>) {
  return <>{children}</>
}

const Fieldset = twc.fieldset`flex flex-col gap-2`

export function BookAuthorsFormFieldset({ children, ...props }: Props) {
  return <Fieldset {...props}>{children}</Fieldset>
}

BookAuthorsFormFieldset.Label = twc.h2``
BookAuthorsFormFieldset.Body = Body
