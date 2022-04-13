import { Manga } from '../../components/Manga'
import { findMangaById, getAllAuthors, wait } from '../../lib/airtable'
import { getDirFiles } from '../../lib/file'

function Author({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ params, locale }) {
  if (process.env.NODE_ENV !== 'development') {
    await wait()
  }
  const data = await findMangaById({ id: params.id })
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: { data, locale, lngDict },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const records = await getAllAuthors()
  const locales = await getDirFiles('locales')
  const ids = records.map((record) => record.id)

  const pathsWithLocale = locales.flatMap((locale) => {
    return ids.map((id) => {
      return {
        params: { id: `${id}` },
        locale: locale.replace('.json', ''),
      }
    })
  })

  return {
    fallback: true,
    paths: pathsWithLocale,
  }
}

export default Author
