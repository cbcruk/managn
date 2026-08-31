import type { FileStore, FileUpload, StoredFile } from '@comp/core'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const COVERS_DIR = path.join(process.cwd(), 'public', 'books')

/**
 * Book covers on the local filesystem, converted to WebP on the way in — what
 * `admin/manga/admin.py`'s `save_model` did, as a store Comp can call.
 *
 * The key is a random name rather than the book's id, because a cover can be
 * chosen on the add form, before there is an id to name it after. Covers that
 * predate the `cover` column keep their `{id}.webp` names; nothing renames
 * them, since the column holds whatever key a file was given.
 *
 * Writing to `public/` only works in development, since the filesystem is
 * read-only on Vercel — which is one of the reasons the admin is dev-only.
 * Comp asks for a store rather than writing files itself, so what that costs
 * to change is this file and nothing else.
 */
export function createCoverStore(): FileStore {
  return {
    async put(upload: FileUpload): Promise<StoredFile> {
      // Comp hands over a `Uint8Array` because a Worker has no `Buffer`;
      // imagemin is Node-only and checks for one at runtime, while its types
      // ask for the `Uint8Array<ArrayBuffer>` a `Buffer` is not.
      const input = Buffer.from(upload.bytes) as unknown as Uint8Array
      const webp = await imagemin.buffer(input, {
        plugins: [imageminWebp({ quality: 80 })],
      })
      const key = `${randomUUID()}.webp`
      await fs.mkdir(COVERS_DIR, { recursive: true })
      await fs.writeFile(path.join(COVERS_DIR, key), webp)
      return { key, url: `/books/${key}` }
    },

    async remove(key: string): Promise<void> {
      // A key is a bare filename by construction; refuse anything that would
      // reach outside the covers directory rather than trusting it.
      if (key !== path.basename(key)) return
      await fs.rm(path.join(COVERS_DIR, key), { force: true })
    },

    url(key: string): string {
      return `/books/${key}`
    },
  }
}
