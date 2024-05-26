import type { ComponentProps } from 'react'

type Props = Pick<ComponentProps<'input'>, 'value'> & ComponentProps<'label'>

export function BookAuthorsFormCheckbox({ value, children }: Props) {
  return (
    <label className="inline-flex items-center gap-1">
      <input type="checkbox" name="authors" value={value} />
      {children}
    </label>
  )
}
