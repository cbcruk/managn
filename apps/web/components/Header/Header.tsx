import Link from 'next/link'
import { Container } from '../Container'
import { I18nSelect } from '../I18nSelect/I18nSelect'
import { Search } from '../Icons'

export function Header() {
  return (
    <div className="sticky top-0 z-10 bg-stone-900">
      <Container className="flex items-center justify-between p-4 py-3">
        <div className="flex">
          <Link href="/">
            <a>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/logo.svg" alt="" width={32} height={32} />
              }
            </a>
          </Link>
        </div>
        <div className="flex">
          <I18nSelect />
        </div>
      </Container>
    </div>
  )
}
