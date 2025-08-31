import { experimental_withState } from '@astrojs/react/actions'
import { actions } from 'astro:actions'
import { type FC, useActionState } from 'react'

type FormProps = {
  children: FC<Omit<ReturnType<typeof useBookAddActionState>, 'action'>>
}

function useBookAddActionState() {
  const [state, action, pending] = useActionState(
    experimental_withState(actions.book),
    null
  )

  return { state, action, pending }
}

export function BookAddFormAction({ children }: FormProps) {
  const { state, action, pending } = useBookAddActionState()

  return (
    <form action={action} encType="multipart/form-data">
      {children({ state, pending })}
    </form>
  )
}
