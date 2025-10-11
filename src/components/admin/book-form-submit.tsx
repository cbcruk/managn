'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

export function BookFormSubmit() {
  const status = useFormStatus()

  return (
    <Button type="submit" disabled={status.pending} className="flex-1">
      저장
    </Button>
  )
}
