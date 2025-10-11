import { PropsWithChildren } from 'react'
import { AdminTabs } from '../admin/admin-tabs'
import { Button } from '../ui/button'
import Link from 'next/link'

type LayoutAdminProps = PropsWithChildren<{
  name: 'books' | 'authors'
}>

export function LayoutAdmin({ name, children }: LayoutAdminProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <AdminTabs defaultValue={name} suppressHydrationWarning />
        <Button variant="outline" size="sm">
          <Link href={`/admin/${name}/add`}>추가</Link>
        </Button>
      </div>
      {children}
    </div>
  )
}
