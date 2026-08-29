import { collections } from '@/lib/comp/collections'
import { createCoverStore } from '@/lib/comp/cover-store'
import { db } from '@/lib/db/managn'
import { createAdminRouter } from '@comp/server'
import { Hono } from 'hono'

export const runtime = 'nodejs'

/**
 * Comp's admin API, mounted inside Next's App Router.
 *
 * `createAdminRouter` returns a Hono app, which Next can serve directly — the
 * route handler hands it the request and returns its response. The db is
 * resolved per request only because the Workers signature asks for it; here it
 * is the one module-level libSQL client.
 */
const app = new Hono().basePath('/api/comp')

app.route(
  '/',
  createAdminRouter({
    collections,
    getDb: () => db,
    files: createCoverStore(),
  }),
)

const handler = (request: Request): Promise<Response> | Response =>
  app.fetch(request)

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
}
