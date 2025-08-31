import { experimental_withState } from '@astrojs/react/actions'
import { actions } from 'astro:actions'
import { type FC, useActionState } from 'react'

type FormProps = {
  children: FC<Omit<ReturnType<typeof useAuthorAddActionState>, 'action'>>
}

function useAuthorAddActionState() {
  const [state, action, pending] = useActionState(
    experimental_withState(actions.author),
    null
  )

  return { state, action, pending }
}

export function AuthorAddFormAction({ children }: FormProps) {
  const { state, action, pending } = useAuthorAddActionState()

  return <form action={action}>{children({ state, pending })}</form>
}
