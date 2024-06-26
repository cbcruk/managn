import { twc } from 'react-twc'

export function BookAuthorsFormLayout({ children }) {
  return <>{children}</>
}

BookAuthorsFormLayout.Title = twc.h1`text-neutral-100`
BookAuthorsFormLayout.FieldsetGroup = twc.div`flex flex-col gap-4 text-sm mt-6`
BookAuthorsFormLayout.Footer = twc.div`flex justify-end mt-4`
