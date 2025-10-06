import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import type { ComponentProps } from 'react'

export function AdminTabs({ defaultValue }: ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="index" asChild>
          <a href="/">홈</a>
        </TabsTrigger>
        <TabsTrigger value="books" asChild>
          <a href="/admin/books/">책</a>
        </TabsTrigger>
        <TabsTrigger value="authors" asChild>
          <a href="/admin/authors/">작가</a>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
