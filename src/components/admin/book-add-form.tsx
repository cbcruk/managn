'use client'

import { Button } from '@components/ui/button'
import { FormLayout, FormLayoutField } from '@components/form/form-layout'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Label } from '@components/ui/label'
import type { Author, Book } from 'db/schema'
import { Fragment, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Badge } from '@components/ui/badge'
import { groupByChoseong } from '@lib/group-by-choseong'

type BookAddFormProps = {
  data: {
    book?: Book
    authors: Author[]
    bookAuthors?: Author[]
  }
}

export function BookAddForm({ data }: BookAddFormProps) {
  const [cover, setCover] = useState<string | null>(null)
  const [bookAuthors, setBookAuthors] = useState(data.bookAuthors ?? [])
  const book = data.book

  return (
    <FormLayout>
      {book?.id && <input type="hidden" name="id" defaultValue={book.id} />}
      <FormLayout.FieldGroup>
        <FormLayoutField>
          {(cover || book?.id) && (
            <img
              src={cover ?? `/books/${book?.id}.webp`}
              alt=""
              width={160}
              className="rounded-md"
            />
          )}
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="title_ko">한국어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="title_ko"
            name="title_ko"
            defaultValue={book?.title_ko}
            required
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="title_ja">일본어</Label>
          </FormLayoutField.Label>
          <Input
            type="text"
            id="title_ja"
            name="title_ja"
            defaultValue={book?.title_ja}
            required
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="authors">작가</Label>
          </FormLayoutField.Label>
          <div className="flex gap-2">
            {bookAuthors?.map((bookAuthor) => (
              <Badge key={bookAuthor.id} variant="secondary" className="py-1">
                <label>
                  <input
                    type="hidden"
                    name="book_authors"
                    defaultValue={bookAuthor.id}
                  />
                  {bookAuthor.name_ko}
                </label>
              </Badge>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">추가</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {groupByChoseong({
                  list: data.authors,
                  key: 'name_ko',
                  includeEmpty: false,
                }).map(({ char, items }) => (
                  <Fragment key={char}>
                    <DropdownMenuLabel className="font-bold">
                      {char}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {items.map((author) => (
                      <DropdownMenuCheckboxItem
                        key={author.id}
                        checked={bookAuthors?.some(
                          (bookAuthor) => bookAuthor.id === author.id
                        )}
                        onCheckedChange={(checked) => {
                          setBookAuthors((prev) =>
                            checked
                              ? prev?.concat(author)
                              : prev?.filter(
                                  (pauthor) => pauthor.id !== author.id
                                )
                          )
                        }}
                      >
                        {author.name_ko}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>상태</FormLayoutField.Label>
          <Select
            name="status"
            required
            defaultValue={book?.status ?? 'release'}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="release">출간</SelectItem>
                <SelectItem value="draft">초안</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="link">링크</Label>
          </FormLayoutField.Label>
          <Input
            type="url"
            id="link"
            name="link"
            defaultValue={book?.link ?? ''}
          />
        </FormLayoutField>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="cover">표지 이미지</Label>
          </FormLayoutField.Label>
          <Input
            type="file"
            id="cover"
            name="cover"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]

              if (file) {
                setCover(URL.createObjectURL(file))
              }
            }}
          />
        </FormLayoutField>
      </FormLayout.FieldGroup>
      <FormLayout.Footer>
        <Button type="submit" className="flex-1">
          저장
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  )
}
