import { Layout } from '@/components/layout/layout'

export default async function LayoutAdmin({ children }: LayoutProps<'/admin'>) {
  return (
    <Layout>
      <Layout.Body className="max-w-full">{children}</Layout.Body>
    </Layout>
  )
}
