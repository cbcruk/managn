import { z } from 'astro/zod'
import * as fs from 'fs/promises'

const mime = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
}

const params = z.object({
  filename: z.string(),
  url: z.string().url(),
  type: z.enum(['image/jpeg', 'image/jpg', 'image/png']),
})

type Params = z.infer<typeof params>

export async function downloadImage({ filename, url, type }: Params) {
  const path = `${import.meta.dir}/assets`
  const response = await fetch(url, {
    headers: {
      'Content-Type': type,
    },
  })
  const extension = mime[type]
  const blob = await response.blob()
  const data = new DataView(await blob.arrayBuffer())

  await fs.writeFile(`${path}/${filename}.${extension}`, data)
}
