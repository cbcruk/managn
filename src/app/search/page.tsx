import { Books } from '@/components/books'
import { LayoutDefault } from '@/components/layout/layout-default'
import { SearchForm } from '@/components/search/search-form'
import { getReleasedBooks } from '@/lib/data'
import Fuse from 'fuse.js'

type SearchParams = {
  q: string
}

type SearchPageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata = {
  title: '검색 | managn',
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const data = await getReleasedBooks()
  const fuse = new Fuse(data, {
    includeScore: true,
    keys: ['title_ko', 'title_ja', 'authors.name_ko', 'authors.name_ja'],
  })
  const { q } = await searchParams
  const result = fuse.search(q || '')

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-4">
        <SearchForm q={q ?? ''} />
        <Books data={result.map((book) => book.item)} />
      </div>
    </LayoutDefault>
  )
}
