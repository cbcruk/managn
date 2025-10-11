import { Books } from '@/components/books'
import { LayoutDefault } from '@/components/layout/layout-default'
import { Nav, NavButton, NavButtonGroup } from '@/components/nav'
import { getRandomBooks } from '@/lib/data'

export default async function Index() {
  const data = await getRandomBooks(10)

  return (
    <LayoutDefault>
      <Books data={data} />
      <Nav>
        <NavButtonGroup>
          <NavButton href="/books/1" className="bg-red-200">
            더보기
          </NavButton>
        </NavButtonGroup>
      </Nav>
    </LayoutDefault>
  )
}
