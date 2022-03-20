import { Manga } from '../components/Manga'
import { getListRecords, getMinifyData } from '../lib/airtable'
import { getDirFiles } from '../lib/file'

function Index({ data }) {
  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps() {
  const data = await getListRecords()
  const files = await getDirFiles()

  return {
    props: {
      data: {
        records: getMinifyData(data),
        pagination: [null, 2, files.length],
      },
    },
    revalidate: 60,
  }
}

export default Index
