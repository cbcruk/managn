export const PAGE_SIZE = 20

export async function getListRecords(offset?: string) {
  const params = getParams(offset).toString()
  const response = await fetch(
    `${process.env.AIRTABLE_URL}/Table%201?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    }
  )
  const data = await response.json()

  return data
}

function getParams(offset: string) {
  const params = new URLSearchParams()
  params.append('pageSize', `${PAGE_SIZE}`)
  params.append('view', 'Grid view')
  params.append('filterByFormula', `SEARCH({status}, 'release')`)

  if (offset) {
    params.append('offset', offset)
  }

  return params
}

export function getMinifyData(data) {
  const { records } = data

  return records.map((record) => {
    const { id, fields } = record

    return {
      id,
      title: fields.title,
      title_ko: fields?.title_ko ?? '',
      authors: fields?.authors ?? '',
      authors_ko: fields?.authors_ko ?? '',
      image: fields.attachments[0]?.thumbnails.large.url,
    }
  })
}

export async function getAllRecords() {
  const records = []
  const offset = { current: '' }

  do {
    const data = await getListRecords(offset.current)

    records.push(getMinifyData(data))

    offset.current = data.offset
  } while (offset.current)

  return records
}
