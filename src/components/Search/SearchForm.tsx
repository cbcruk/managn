import type { ComponentProps } from 'react'

type Props = {
  q: ComponentProps<'input'>['defaultValue']
}

export function SearchForm({ q }: Props) {
  return (
    <form action="/search">
      <input
        type="search"
        name="q"
        defaultValue={q}
        className="w-full rounded-3xl p-4 bg-stone-900/90 text-neutral-100 text-sm font-bold"
        autoFocus
      />
    </form>
  )
}
