'use client'

import { createAuthor, updateAuthor, State } from '@/actions'
import { PropsWithChildren, useActionState } from 'react'

export function AuthorFormEditAction({ children }: PropsWithChildren) {
  const [, formAction] = useActionState<State, FormData>(updateAuthor, {
    data: null,
    error: null,
  })

  return <form action={formAction}>{children}</form>
}

export function AuthorFormCreateAction({ children }: PropsWithChildren) {
  const [, formAction] = useActionState<State, FormData>(createAuthor, {
    data: null,
    error: null,
  })

  return <form action={formAction}>{children}</form>
}
