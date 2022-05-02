import { promises as fs } from 'fs'
import path from 'path'

export async function isExist(fileName) {
  try {
    await fs.access(getFilePath({ fileName }))
    return true
  } catch (error) {
    return false
  }
}

function getFilePath({ fileName }) {
  const result = path.join(process.cwd(), '.cached', `${fileName}.json`)
  return result
}

export async function getFile({ fileName }) {
  try {
    const path = getFilePath({ fileName })
    const contents = await fs.readFile(path, 'utf-8')

    return contents
  } catch (error) {
    console.log(error)
  }
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
