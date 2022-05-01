import { promises as fs } from 'fs'
import path from 'path'

export function isExist(path) {
  return fs.access(path)
}

function getFilePath({ fileName }) {
  const result = path.join(process.cwd(), '.cached', `${fileName}.json`)
  return result
}

export async function getFile({ fileName }) {
  const path = getFilePath({ fileName })
  const contents = await fs.readFile(path, 'utf-8')

  return contents
}

export async function writeFile({ fileName, data }) {
  const path = getFilePath({ fileName })

  await fs.writeFile(path, data)
}

export async function getDirFiles(dir: string) {
  const directory = path.join(process.cwd(), dir)
  const filenames = await fs.readdir(directory)

  return filenames
}
