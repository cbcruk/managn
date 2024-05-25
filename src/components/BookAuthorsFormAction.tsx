import { experimental_withState } from '@astrojs/react/actions'
import { actions } from 'astro:actions'
import { type FC, useActionState } from 'react'

type FormProps = {
  children: FC<Omit<ReturnType<typeof useBookAuthorsActionState>, 'action'>>
}

function useBookAuthorsActionState() {
  const [state, action, pending] = useActionState(
    experimental_withState(actions.bookAuthors),
    null
  )

  return { state, action, pending }
}

export function BookAuthorsFormAction({ children }: FormProps) {
  const { state, action, pending } = useBookAuthorsActionState()

  return <form action={action}>{children({ state, pending })}</form>
}
