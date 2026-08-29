'use client'

import {
  AdminSite,
  Toasts,
  createClient,
  useHashRoute,
  useToasts,
  type CollectionSummary,
} from '@comp/admin'
import { useEffect, useState, type JSX } from 'react'

const client = createClient({ baseUrl: '/api/comp' })

/**
 * The whole Comp admin. Every screen below it — the index, each collection's
 * list with its search and filters, the add/change form, the delete
 * confirmation — is generated from what `/api/comp/collections` reports, so
 * nothing here is written per collection.
 */
export function CompAdmin(): JSX.Element {
  const [collections, setCollections] = useState<CollectionSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const { route, navigate } = useHashRoute()
  const { toasts, notify, dismiss } = useToasts()

  useEffect(() => {
    client
      .collections()
      .then(setCollections)
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : String(cause)),
      )
  }, [])

  if (error) return <p role="alert">{error}</p>
  if (collections.length === 0) return <p>Loading…</p>

  return (
    <AdminSite
      className="comp-admin"
      client={client}
      collections={collections}
      route={route}
      onNavigate={navigate}
      onNotify={notify}
      title="managn 어드민"
      header={<Toasts toasts={toasts} onDismiss={dismiss} />}
    />
  )
}
