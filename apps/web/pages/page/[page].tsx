import { Manga } from '../../components/Manga'
import { getAllRecords } from '../../lib/airtable'
import { getFile, writeFile } from '../../lib/file'

function Page({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={data.pagination} />
}

export async function getStaticProps({ params }) {
  const contents = await getFile({ fileName: `${params.page}` })
  const data = JSON.parse(contents)

  return {
    props: { data },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const records = await getAllRecords()
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

  return {
    fallback: true,
    paths: paths.map((page) => {
      return { params: { page: `${page}` } }
    }),
  }
}

export default Page
