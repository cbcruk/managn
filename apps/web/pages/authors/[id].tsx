import { Manga } from '../../components/Manga'
import { getAllAuthors, setCacheAuthors } from '../../lib/airtable'
import { getDirFiles, getFile } from '../../lib/file'
import { Author } from '../../lib/types'

function Author({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data} pagination={null} />
}

export async function getStaticProps({ params, locale }) {
  const data = await getFile({ fileName: `/[author]/${params.id}` })
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: { data: JSON.parse(data), locale, lngDict },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const authors = await getAllAuthors()
  const locales = await getDirFiles('locales')

  await setCacheAuthors(authors)

  const pathsWithLocale = locales.flatMap((locale) => {
    return authors.map((author) => {
      return {
        params: { id: `${author.id}` },
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
