import { LayoutDefault } from '@/components/layout/layout-default'
import { getAuthors } from '@/lib/data'
import { groupByChoseong } from '@/lib/utils/hangul'
import Link from 'next/link'

export default async function AuthorsPage() {
  const authors = await getAuthors()
  const authorGroupByChoseong = groupByChoseong({
    list: authors,
    key: 'name_ko',
  })

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-4">
        <div className="sticky top-[72px] grid grid-cols-10 gap-2 p-4 rounded-3xl bg-zinc-900">
          {authorGroupByChoseong.map((group) => {
            const key = group.char
            const hasItems = group.items.length > 0

            return (
              <a
                key={key}
                href={`#${key}`}
                data-has-items={hasItems}
                className="text-zinc-400 data-[has-items='false']:pointer-events-none data-[has-items='false']:text-zinc-400/20"
              >
                {key}
              </a>
            )
          })}
        </div>
        <div className="flex flex-col gap-4">
          {authorGroupByChoseong.map((group) => {
            if (group.items.length === 0) {
              return null
            }

            return (
              <div
                key={group.char}
                id={group.char}
                className="flex flex-col gap-2 scroll-m-44"
              >
                <div className="text-lg text-stone-400/90" hidden>
                  {group.char}
                </div>
                <div className="grid grid-cols-2 gap-1 gap-x-2 p-4 rounded-3xl bg-stone-900">
                  {group.items.map((item) => {
                    return (
                      <Link
                        key={item.id}
                        href={`/author/${item.id}`}
                        className="inline-block min-w-[50%] overflow-hidden text-ellipsis px-1 text-stone-400 text-sm text-nowrap hover:text-stone-100 hover:font-bold transition-all"
                      >
                        {item.name_ko} ({item.name_ja})
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </LayoutDefault>
  )
}
