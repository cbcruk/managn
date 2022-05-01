import { getList, getListAll } from '@cbcruk/airtable'
import { Author, Manga } from './types'

export function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

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
  const data = await getListAll(getManga)
  return data
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
  const data = await getListAll(getAuthor)
  return data.flatMap((r) => r)
}
