import clsx, { ClassValue } from 'clsx'
import { ReactNode } from 'react'

interface Props {
  className?: ClassValue
  children: ReactNode
}

export function Container({ className, children }: Props) {
  return (
    <div className={clsx('max-w-[360px] mx-auto', className)}>{children}</div>
  )
}
