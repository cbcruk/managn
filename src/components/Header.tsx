import { Container } from './Container'

export function Header() {
  return (
    <div className="sticky top-0 z-10 bg-stone-900">
      <Container className="flex items-center justify-between p-4 py-3">
        <div className="flex">
          <a href="/">
            <img src="/favicon.svg" alt="" width={32} height={32} />
          </a>
        </div>
      </Container>
    </div>
  )
}
