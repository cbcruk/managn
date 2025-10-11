'use client'

import { X } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Author } from '@/lib/db/schema'
import { useMemo, useState, useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { groupByChoseong } from '@/lib/utils/hangul'

type BookFormAuthorsClientProps = {
  defaultSelected: Array<Author['id']>
  authors: Author[]
}

export function BookFormAuthorsClient({
  defaultSelected,
  authors,
}: BookFormAuthorsClientProps) {
  const [, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deletedIds, setDeletedIds] = useState<number[]>([])
  const authorsMap = useMemo(
    () => new Map(authors.map((author) => [author.id, author])),
    [authors]
  )
  const mergedIds = useMemo(
    () => [...new Set([defaultSelected, selectedIds].flat())],
    [defaultSelected, selectedIds]
  )
  const authorsGroupByChoseong = useMemo(
    () =>
      groupByChoseong({
        list: authors,
        key: 'name_ko',
        includeEmpty: false,
      }),
    [authors]
  )

  return (
    <>
      {selectedIds.map((id) => (
        <input
          key={id}
          type="hidden"
          name="added_book_authors"
          defaultValue={id}
        />
      ))}

      {deletedIds.map((id) => (
        <input
          key={id}
          type="hidden"
          name="deleted_book_authors"
          defaultValue={id}
        />
      ))}

      <div className="flex flex-col gap-4">
        <Select
          value=""
          onValueChange={(value) => {
            const id = parseInt(value, 10)

            startTransition(() => {
              if (deletedIds.includes(id)) {
                setDeletedIds((ids) =>
                  ids.filter((deletedId) => deletedId !== id)
                )
              }

              if (!mergedIds.includes(id)) {
                setSelectedIds((ids) => ids.concat(id))
              }
            })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {authorsGroupByChoseong.map(({ char, items }) => (
              <SelectGroup key={char}>
                <SelectLabel>{char}</SelectLabel>
                {items.map((author) => (
                  <SelectItem
                    key={author.id}
                    value={`${author.id}`}
                    disabled={
                      mergedIds.includes(author.id) &&
                      !deletedIds.includes(author.id)
                    }
                  >
                    {author.name_ko}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap items-center gap-2">
          {mergedIds
            .filter((id) => !deletedIds.includes(id))
            .map((id) => (
              <Badge key={id} variant="secondary" className="py-1">
                {authorsMap.get(id)?.name_ko}
                <Button
                  type="button"
                  size="xs"
                  className="max-w-0"
                  onClick={() => {
                    setDeletedIds((prev) => prev.concat(id))
                  }}
                >
                  <X />
                </Button>
              </Badge>
            ))}
        </div>
      </div>
    </>
  )
}
