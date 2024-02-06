import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url)

  if (url.pathname.startsWith('/api')) {
    if (import.meta.env.NODE_ENV === 'production') {
      return new Response(null, {
        status: 404,
        statusText: 'Not found',
      })
    }
  }

  return next()
})
