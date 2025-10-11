'use server'

import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import fs from 'node:fs/promises'
import { Book } from '../db/schema'

export async function createImage(id: Book['id'], cover: File) {
  if (id && cover && cover.size > 0) {
    try {
      const arrayBuffer = await cover.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const result = await imagemin.buffer(buffer as unknown as Uint8Array, {
        plugins: [
          imageminWebp({
            quality: 80,
          }),
        ],
      })
      await fs.writeFile(`public/books/${id}.webp`, result)
    } catch (error) {
      console.error('ERROR', error)
    }
  }
}
