import { AirtableResponse } from '@cbcruk/airtable'
import { Manga } from '../../components/Manga'
import { getAllAuthors, getAllManga } from '../../lib/airtable'
import { getDirFiles, getFile, writeFile } from '../../lib/file'
import { Author } from '../../lib/types'

type Props = {
  data: AirtableResponse<Author>
}

function Author({ data }: Props) {
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
  const mangas = await getAllManga()
  const locales = await getDirFiles('locales')
  const ids = authors.map((author) => author.id)

  for (const author of authors) {
    const data = mangas
      .flatMap((r) => r)
      .filter((manga) => manga.table2.includes(author.fields.record_id))

    await writeFile({
      fileName: `/[author]/${author.fields.record_id}`,
      data: JSON.stringify(data),
    })
  }

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
