import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LayoutHeader } from './LayoutHeader'
import styles from './LayoutHeader.module.css'

describe('LayoutHeader', () => {
  it('정상적으로 렌더링되어야 한다', () => {
    const utils = render(<LayoutHeader />)

    expect(utils.container).toBeInTheDocument()
  })

  it('올바른 루트 클래스를 가져야 한다', () => {
    const utils = render(<LayoutHeader />)

    expect(utils.container.firstChild).toHaveClass(styles.root)
  })

  it('올바른 속성으로 로고를 렌더링해야 한다', () => {
    const utils = render(<LayoutHeader />)
    const logo = utils.getByAltText('홈으로')

    expect(logo).toHaveAttribute('src', '/favicon.svg')
    expect(logo).toHaveAttribute('width', '32')
    expect(logo).toHaveAttribute('height', '32')
  })

  it('올바른 클래스가 적용된 Container를 렌더링해야 한다', () => {
    const utils = render(<LayoutHeader />)
    const containerDiv = utils.container.querySelector(
      '[data-part="container"]'
    )

    expect(containerDiv).toHaveClass(
      'flex items-center justify-between p-4 py-3'
    )
  })
})
