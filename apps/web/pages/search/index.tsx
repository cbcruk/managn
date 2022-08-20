import { Manga } from '../../components/Manga'
import { getManga } from '../../lib/airtable'

function Search({ data }) {
  if (!data) {
    return null
  }

  return <Manga list={data.records} pagination={null} />
}

const searchFormula = ({ authors }) =>
  `AND(SEARCH('${authors}', {authors}), AND({status}, 'release'))`

export async function getServerSideProps({ locale, query }) {
  const data = await getManga({
    filterByFormula: searchFormula(query),
  })
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: { data, locale, lngDict },
  }
}

export default Search
