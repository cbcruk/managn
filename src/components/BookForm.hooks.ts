import { useState } from 'react'

type Name = 'book' | 'author'

export function useTab() {
  const [name, setName] = useState<Name>('book')

  return {
    name,
    setName,
  } as const
}
