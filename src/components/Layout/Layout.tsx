import type { ComponentProps } from 'react'
import { LayoutHeader } from './LayoutHeader'
import { LayoutBody } from './LayoutBody'

type Props = ComponentProps<'main'>

/**
 * 레이아웃을 위한 컴포넌트
 *
 * @example
 * ```tsx
 * <Layout>
 *   <LayoutHeader />
 *   <LayoutBody>
 *     <slot />
 *   </LayoutBody>
 *  </Layout>
 * ```
 */
export function Layout({ children }: Props) {
  return <main className="flex flex-col min-h-screen">{children}</main>
}

Layout.Header = LayoutHeader
Layout.Body = LayoutBody
