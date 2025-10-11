import { PropsWithChildren } from 'react'
import { Layout } from './layout'

export function LayoutDefault({ children }: PropsWithChildren) {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Body>{children}</Layout.Body>
    </Layout>
  )
}
