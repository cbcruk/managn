import { getLastIndex, paginationFormula } from '@cbcruk/next-utils'
import { Manga } from '../../components/Manga'
import { getLastPage, getManga, PAGE_SIZE } from '../../lib/airtable'
import { getDirFiles } from '../../lib/file'

function Page({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={data.pagination} />
}

function getPagination(page: string) {
  const currentPage = parseInt(page, 10)
  const startIndex = PAGE_SIZE * (currentPage - 1) + 1
  const endIndex = startIndex + PAGE_SIZE - 1

  return {
    page: currentPage,
    startIndex,
    endIndex,
  }
}

export async function getStaticProps({ params, locale }) {
  const { page, startIndex, endIndex } = getPagination(params.page)
  const [total, data] = await Promise.all([
    getLastIndex(),
    getManga({
      filterByFormula: paginationFormula({ start: startIndex, end: endIndex }),
    }),
  ])
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  if (!data) {
    return {
      notFound: true,
    }
  }

  if (page === 1) {
    return {
      redirect: {
        destination: '/manga',
        permanent: false,
      },
    }
  }

  return {
    props: {
      data: {
        records: data.records,
        pagination: [page - 1, page + 1, getLastPage(total)],
      },
      locale,
      lngDict,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const total = await getLastIndex()
  const locales = await getDirFiles('locales')
  const paths = Array.from({ length: getLastPage(total) }).map(
    (_, index) => index + 2
  )
  const pathsWithLocale = locales.flatMap((locale) => {
    return paths.map((page) => {
      return {
        params: { page: `${page}` },
        locale: locale.replace('.json', ''),
      }
    })
  })

  return {
    fallback: 'blocking',
    paths: pathsWithLocale,
  }
}

export default Page
