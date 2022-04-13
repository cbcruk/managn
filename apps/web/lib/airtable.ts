export function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const airtable = (() => {
  const baseURL = process.env.AIRTABLE_URL
  const defaultHeaders = {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  }
  const defaultParams = {
    view: 'Grid view',
  }

  return {
    get: async (url, { params = {}, headers = {} }) => {
      const searchParams = new URLSearchParams()

      Object.entries({
        ...defaultParams,
        ...params,
      }).forEach(([key, value]) => {
        searchParams.append(key, `${value}`)
      })

      const query = searchParams.toString()
      const response = await fetch(`${baseURL + url}?${query}`, {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      const data = await response.json()

      return { data }
    },
  }
})()

export const PAGE_SIZE = 20

export function getMinifyData(records) {
  return records.map((record) => {
    const { id, fields } = record

    return {
      id,
      title: fields.title,
      title_ko: fields?.title_ko ?? '',
      authors: fields?.authors ?? '',
      authors_ko: fields?.authors_ko ?? '',
      image: fields.attachments?.[0]?.thumbnails.large.url,
      table2: fields.table2,
    }
  })
}

export async function getManga(params) {
  const { data } = await airtable.get('/Table%201', {
    params: {
      pageSize: PAGE_SIZE,
      filterByFormula: `AND({status}, 'release')`,
      ...params,
    },
  })

  return data
}

export async function getAllManga() {
  const records = []
  const offset = { current: '' }

  do {
    const data = await getManga({
      offset: offset.current,
    })

    records.push(getMinifyData(data.records))

    offset.current = data.offset
  } while (offset.current)

  return records
}

export async function findMangaById({ id }) {
  const data = await getManga({
    filterByFormula: `AND(AND({table2}, SEARCH('${id}', {table2})), AND({status}, 'release'))`,
  })

  return {
    records: getMinifyData(data.records),
  }
}

export async function getIndex() {
  const { data } = await airtable.get('/Table%203', {
    params: {
      pageSize: '1',
      'sort[0][field]': 'index',
      'sort[0][direction]': 'desc',
      fields: ['table1', 'desc'],
    },
  })

  return data
}

export async function getAuthor(params) {
  const { data } = await airtable.get('/Table%202', {
    params: {
      'sort[0][field]': 'count',
      'sort[0][direction]': 'desc',
      ...params,
    },
  })

  return data
}

export async function getAllAuthors() {
  const records = []
  const offset = { current: '' }

  do {
    const data = await getAuthor({ offset: offset.current })

    records.push(
      data.records.map((record) => {
        return {
          id: record.id,
          ...record.fields,
        }
      })
    )

    offset.current = data.offset
  } while (offset.current)

  return records.flatMap((r) => r)
}
