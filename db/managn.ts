import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({
  url: 'file:managn.db',
})

export const db = drizzle(client)
