import { Checkbox } from '@components/components/ui/checkbox'
import type { ComponentProps } from 'react'

type Props = Pick<ComponentProps<'input'>, 'value'> & ComponentProps<'label'>

export function BookAuthorsFormCheckbox({ value, children }: Props) {
  return (
    <label className="inline-flex items-center gap-2">
      <Checkbox name="authors" value={value} />
      <span className="text-sm">{children}</span>
    </label>
  )
}
