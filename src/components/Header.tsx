import { twc } from 'react-twc'
import { Container } from './Container'
import styles from './Header.module.css'

const HeaderRoot = twc.div`sticky top-0 z-10 bg-stone-900/90 backdrop-blur-sm`

export function Header() {
  return (
    <HeaderRoot className={styles.root}>
      <Container className="flex items-center justify-between p-4 py-3">
        <div className="flex">
          <a href="/">
            <img src="/favicon.svg" alt="홈으로" width={32} height={32} />
          </a>
        </div>
      </Container>
    </HeaderRoot>
  )
}
