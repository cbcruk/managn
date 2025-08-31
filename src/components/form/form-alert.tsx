import type { FallbackProps } from 'react-error-boundary'

export function FormAlert({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" onDoubleClick={resetErrorBoundary}>
      <pre className="text-neutral-100 font-mono text-sm">
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  )
}
