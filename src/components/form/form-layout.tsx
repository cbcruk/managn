import type { ComponentProps, PropsWithChildren } from 'react'
import { twc } from 'react-twc'

export function FormLayout({ children }: PropsWithChildren) {
  return <>{children}</>
}

FormLayout.Title = twc.h1`text-neutral-100 font-medium`
FormLayout.FieldGroup = twc.div`flex flex-col gap-4 text-sm mt-6`
FormLayout.Footer = twc.div`flex mt-6`

export function FormLayoutField({ children, ...props }: ComponentProps<'div'>) {
  return (
    <div className="flex flex-col gap-2" {...props}>
      {children}
    </div>
  )
}

FormLayoutField.Label = twc.div`text-neutral-100`
FormLayoutField.Body = twc.div``
