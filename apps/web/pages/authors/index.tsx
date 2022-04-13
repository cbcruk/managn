import Link from 'next/link'
import { Container } from '../../components/Container'
import { getAllAuthors } from '../../lib/airtable'

function Authors({ data }) {
  return (
    <Container>
      <div className="flex flex-col items-start">
        {data.map((author) => {
          return (
            <div
              key={author.id}
              className="text-neutral-100 rounded-full py-2 px-4 m-1"
            >
              <Link href={`/authors/${author.id}`}>
                <a className="text-lg">
                  {author.author_ko}{' '}
                  <span className="text-sm">({author.author})</span>
                </a>
              </Link>
              <div className="text-xs text-neutral-400">
                {author.title_ko?.join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export async function getStaticProps({ locale }) {
  const data = await getAllAuthors()
  const { default: lngDict = {} } = await import(`../../locales/${locale}.json`)

  return {
    props: {
      data,
      locale,
      lngDict,
    },
    revalidate: 60,
  }
}

export default Authors
