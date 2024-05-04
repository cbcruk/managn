import type { APIRoute } from 'astro'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

export const POST: APIRoute = async () => {
  await imagemin(['src/content/books/assets/*.{jpg,jpeg,png}'], {
    destination: 'src/content/books/assets',
    plugins: [
      imageminWebp({
        quality: 50,
      }),
    ],
  })

  return new Response(JSON.stringify({ message: 'SUCCESS' }), { status: 200 })
}
