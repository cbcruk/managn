import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import type { ComponentProps } from 'react'

export function AdminTabs({ defaultValue }: ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="books" asChild suppressHydrationWarning>
          <Link href="/admin/books/">책</Link>
        </TabsTrigger>
        <TabsTrigger value="authors" asChild suppressHydrationWarning>
          <Link href="/admin/authors/">작가</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
