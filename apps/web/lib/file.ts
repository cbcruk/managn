import { promises as fs } from 'fs'
import path from 'path'

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

export async function getDirFiles() {
  const directory = path.join(process.cwd(), '.cached')
  const filenames = await fs.readdir(directory)

  return filenames
}
