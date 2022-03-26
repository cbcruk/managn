import clsx, { ClassValue } from 'clsx'
import { ReactNode } from 'react'
import { MAX_WIDTH } from '../../constants'

interface Props {
  className?: ClassValue
  children: ReactNode
}

export function Container({ className, children }: Props) {
  return (
    <div className={clsx(`max-w-[${MAX_WIDTH}px] mx-auto`, className)}>
      {children}
    </div>
  )
}
