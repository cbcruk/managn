import { Manga } from '../../components/Manga'
import {
  getLastIndex,
  getLastPage,
  getManga,
  paginationFormula,
} from '../../lib/airtable'

function Index({ data }) {
  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ locale }) {
  const [total, data] = await Promise.all([
    getLastIndex(),
    getManga({
      filterByFormula: paginationFormula({ start: 1, end: 20 }),
    }),
  ])
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: {
      data: {
        records: data.records,
        pagination: [null, 2, getLastPage(total)],
      },
      locale,
      lngDict,
    },
    revalidate: 60,
  }
}

export default Index
