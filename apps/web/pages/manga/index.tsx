import { Manga } from '../../components/Manga'
import { getManga, getMinifyData } from '../../lib/airtable'
import { getDirFiles } from '../../lib/file'

function Index({ data }) {
  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ locale }) {
  const data = await getManga()
  const files = await getDirFiles('.cached')
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: {
      data: {
        records: getMinifyData(data.records),
        pagination: [null, 2, files.length],
      },
      locale,
      lngDict,
    },
    revalidate: 60,
  }
}

export default Index
