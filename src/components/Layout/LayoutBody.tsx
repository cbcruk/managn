import type { ComponentProps } from 'react'

type Props = ComponentProps<'div'>

export function LayoutBody({ children }: Props) {
  return (
    <div className="grow">
      <div className="max-w-[414px] mx-auto p-4">{children}</div>
    </div>
  )
}
