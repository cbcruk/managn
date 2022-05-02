import { Manga } from '../../components/Manga'
import { getAllManga, setCacheAllManga } from '../../lib/airtable'
import { getDirFiles, getFile } from '../../lib/file'

function Page({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ params, locale }) {
  const contents = await getFile({ fileName: `/[page]/${params.page}` })
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: { data: JSON.parse(contents), locale, lngDict },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const records = await getAllManga()
  const paths = await setCacheAllManga(records)
  const locales = await getDirFiles('locales')

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
