import { Container } from '../Container'
import { List } from '../List'
import { Nav } from '../Nav'

export function Manga({ list, pagination }) {
  return (
    <Container className="p-4">
      <List list={list} />
      <Nav pagination={pagination} />
    </Container>
  )
}
