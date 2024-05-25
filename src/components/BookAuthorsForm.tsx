import { actions } from 'astro:actions'
import type { AuthorsData, BooksData } from '@pages/form.astro'
import { useActionState } from 'react'
import { experimental_withState } from '@astrojs/react/actions'

type Props = {
  data: {
    booksData: BooksData
    authorsData: AuthorsData
  }
}

export function BookAuthorsForm({ data }: Props) {
  const [, action, pending] = useActionState(
    experimental_withState(actions.bookAuthors),
    null
  )

  return (
    <form action={action}>
      <h1 className="text-neutral-100">책-작가</h1>

      <div className="flex flex-col gap-4 text-sm mt-6">
        <div className="flex flex-col gap-2">
          <label className="text-neutral-100">책</label>
          <input
            type="text"
            name="book"
            list="datalist-book"
            className="h-6 p-2 rounded-md text-xs"
          />
          <datalist
            id="datalist-book"
            onInput={(e) => {
              console.log(e.target)
              console.log(e.currentTarget)
            }}
          >
            {data.booksData
              .toSorted((a, b) => a.title_ko.localeCompare(b.title_ko))
              .map((book) => (
                <option
                  key={book.id}
                  value={book.id}
                  label={book.title_ko || book.title_ja}
                />
              ))}
          </datalist>
        </div>
        <div
          role="group"
          aria-labelledby="작가-group-heading"
          className="flex flex-col gap-2 text-neutral-100"
        >
          <h2 id="작가-group-heading">작가</h2>
          <div className="flex flex-wrap gap-2 max-h-[500px] overflow-auto">
            {data.authorsData
              .toSorted((a, b) => a.name_ko.localeCompare(b.name_ko))
              .map((author) => (
                <label
                  key={author.id}
                  className="inline-flex items-center gap-1"
                >
                  <input type="checkbox" name="authors" value={author.id} />
                  {author.name_ko || author.name_ja}
                </label>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="flex-1 rounded-lg p-1 bg-red-200 text-xs"
          disabled={pending}
        >
          저장
        </button>
      </div>
    </form>
  )
}
