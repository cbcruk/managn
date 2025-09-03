import type { APIRoute } from 'astro'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

export const POST: APIRoute = async () => {
  await imagemin(['public/books/*.{jpg,jpeg,png}'], {
    destination: 'public/books',
    plugins: [
      imageminWebp({
        quality: 50,
      }),
    ],
  })

  return new Response(JSON.stringify({ message: 'SUCCESS' }), { status: 200 })
}
