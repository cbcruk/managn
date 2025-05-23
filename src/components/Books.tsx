import type { BookWithAuthors } from '@content/config'
import { BookAuthor } from './BookAuthor'

type Props = {
  data: BookWithAuthors[]
}

export function Books({ data }: Props) {
  return (
    <div className="flex flex-col items-center pb-4 gap-4">
      {data.map((item) => {
        return (
          <div
            id={`books-${item.id}`}
            key={item.id}
            className="flex flex-col w-full max-w-[414px] rounded-3xl shadow-lg bg-neutral-900"
          >
            <div className="overflow-hidden">
              <img
                src={item.data.cover?.src}
                alt=""
                width={414}
                loading="lazy"
                className="rounded-3xl object-cover object-left-top"
                style={{ aspectRatio: 240 / 347 }}
              />
            </div>
            <div className="flex flex-col p-4 py-4 text-neutral-100">
              <div className="flex flex-wrap items-end gap-1 text-2xl">
                <span className="flex items-end gap-1 whitespace-nowrap overflow-x-auto">
                  {item.data.title_ko}
                  <span className="text-sm">({item.data.title_ja})</span>
                </span>
              </div>
              <div className="flex gap-2 py-1 text-sm whitespace-nowrap overflow-x-auto">
                {item.data.authors.map((author, index) => {
                  const authorRef = item.ref.authors[index]

                  return (
                    <BookAuthor
                      key={author.id}
                      data={{
                        id: author.id,
                        name_ko: authorRef.data.name_ko,
                        name_ja: authorRef.data.name_ja,
                      }}
                    />
                  )
                })}
              </div>
              <div className="hidden justify-end py-4">
                <a
                  href={item.data?.link ?? ''}
                  target="_blank"
                  className="inline-block h-[40px] min-w-[90px] p-2 rounded-full bg-red-200 text-slate-900 text-sm text-center"
                >
                  Amazon
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
