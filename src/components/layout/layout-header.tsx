import { twc } from 'react-twc'
import { Container } from '../container'
import styles from './layout-header.module.css'

const LayoutHeaderRoot = twc.div`sticky top-0 z-10 bg-stone-900/90 backdrop-blur-sm`

export function LayoutHeader() {
  return (
    <LayoutHeaderRoot className={styles.root}>
      <Container
        data-part="container"
        className="flex items-center justify-between p-4 py-3"
      >
        <div className="flex">
          <a href="/">
            <img src="/favicon.svg" alt="홈으로" width={32} height={32} />
          </a>
        </div>
        <div className="flex items-center text-neutral-100/90">
          <a href="/search" aria-label="검색" className="text-lg">
            👀
          </a>
        </div>
      </Container>
    </LayoutHeaderRoot>
  )
}
