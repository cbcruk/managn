'use client'

import { createBook, updateBook, State } from '@/actions'
import { PropsWithChildren, useActionState } from 'react'

export function BookFormEditAction({ children }: PropsWithChildren) {
  const [, formAction] = useActionState<State, FormData>(updateBook, {
    data: null,
    error: null,
  })

  return <form action={formAction}>{children}</form>
}

export function BookFormCreateAction({ children }: PropsWithChildren) {
  const [, formAction] = useActionState<State, FormData>(createBook, {
    data: null,
    error: null,
  })

  return <form action={formAction}>{children}</form>
}
