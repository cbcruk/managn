import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ComponentProps<'div'>

export function LayoutBody({ className, children }: Props) {
  return (
    <div className="grow">
      <div className={twMerge('max-w-[414px] mx-auto p-4', className)}>
        {children}
      </div>
    </div>
  )
}
