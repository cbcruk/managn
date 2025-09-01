import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Layout } from './layout'

describe('Layout', () => {
  it('정상적으로 렌더링되어야 한다', () => {
    const utils = render(
      <Layout>
        <pre data-testid="slot-1">1</pre>
        <pre data-testid="slot-2">2</pre>
      </Layout>
    )

    expect(utils.getByTestId('slot-1')).toBeInTheDocument()
    expect(utils.getByTestId('slot-2')).toBeInTheDocument()
  })
})
