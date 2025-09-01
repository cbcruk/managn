import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LayoutBody } from './layout-body'

describe('LayoutBody', () => {
  it('정상적으로 렌더링되어야 한다', () => {
    const utils = render(
      <LayoutBody>
        <pre data-testid="slot">slot</pre>
      </LayoutBody>
    )

    expect(utils.getByTestId('slot')).toBeInTheDocument()
  })
})
