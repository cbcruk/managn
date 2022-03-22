import { Manga } from '../../components/Manga'
import { getAllRecords } from '../../lib/airtable'
import { getDirFiles, getFile, writeFile } from '../../lib/file'

function Page({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ params, locale }) {
  const contents = await getFile({ fileName: `${params.page}` })
  const data = JSON.parse(contents)
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: { data, locale, lngDict },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const records = await getAllRecords()
  const locales = await getDirFiles('locales')
  const paths = []

  for (const record of records) {
    const total = records.length
    const index = paths.length + 1
    const prev = index === 1 ? null : index - 1
    const next = index === total ? null : index + 1
    const pagination = [prev, next, total]

    await writeFile({
      fileName: `${index}`,
      data: JSON.stringify({
        records: record,
        pagination,
      }),
    })

    paths.push(index)
  }

  const pathsWithLocale = locales.flatMap((locale) => {
    return paths.map((page) => {
      return {
        params: { page: `${page}` },
        locale: locale.replace('.json', ''),
      }
    })
  })

  return {
    fallback: true,
    paths: pathsWithLocale,
  }
}

export default Page
