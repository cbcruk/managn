import { getList, getListAll } from '@cbcruk/airtable'
import { getFile, isExist, writeFile } from './file'
import { Author, Manga } from './types'

export async function getManga(params = {}) {
  const data = await getList<Manga>({
    url: '/Table%201',
    params: {
      filterByFormula: `AND({status}, 'release')`,
      ...params,
    },
  })

  return Object.assign(data, {
    records: data.records.map((record) => {
      const { id, fields } = record
      const { attachments, ...restFields } = fields

      return {
        id,
        ...restFields,
        image: attachments?.[0]?.thumbnails.large.url,
      }
    }),
  })
}

export async function getAllManga() {
  if (process.env.NODE_ENV === 'development') {
    const cached = await isExist('allmanga')

    if (cached) {
      const data = await getFile({ fileName: 'allmanga' })
      return JSON.parse(data)
    }
  }

  const data = await getListAll(getManga)
  await writeFile({
    fileName: 'allmanga',
    data: JSON.stringify(data),
  })

  return data
}

export async function setCacheAllManga(records) {
  const paths = []

  for (const record of records) {
    const total = records.length
    const index = paths.length + 1
    const prev = index === 1 ? null : index - 1
    const next = index === total ? null : index + 1
    const pagination = [prev, next, total]

    await writeFile({
      fileName: `/[page]/${index}`,
      data: JSON.stringify({
        records: record,
        pagination,
      }),
    })

    paths.push(index)
  }

  return paths
}

export async function findMangaById({ id }) {
  const data = await getManga({
    filterByFormula: `AND(AND({table2}, SEARCH('${id}', {table2})), AND({status}, 'release'))`,
  })

  return data
}

export async function getIndex() {
  const data = await getList({
    url: '/Table%203',
    params: {
      pageSize: '1',
      sort: [
        {
          field: 'index',
          direction: 'desc',
        },
      ],
      fields: ['table1', 'desc'],
    },
  })

  return data
}

export async function getAuthor(params = {}) {
  const data = await getList<Author>({
    url: '/Table%202',
    params: {
      sort: [
        {
          field: 'count',
          direction: 'desc',
        },
      ],
      fields: ['author_ko', 'author', 'title_ko', 'record_id'],
      ...params,
    },
  })

  return data
}

export async function getAllAuthors() {
  if (process.env.NODE_ENV === 'development') {
    const cached = await isExist('allauthors')

    if (cached) {
      const data = await getFile({ fileName: 'allauthors' })
      return JSON.parse(data).flatMap((r) => r)
    }
  }

  const data = await getListAll(getAuthor)

  await writeFile({
    fileName: 'allauthors',
    data: JSON.stringify(data),
  })

  return data.flatMap((r) => r)
}

export async function setCacheAuthors(authors) {
  const mangas = await getAllManga()

  for (const author of authors) {
    const data = mangas
      .flatMap((r) => r)
      .filter((manga) => manga.table2.includes(author.fields.record_id))

    await writeFile({
      fileName: `/[author]/${author.fields.record_id}`,
      data: JSON.stringify(data),
    })
  }
}
