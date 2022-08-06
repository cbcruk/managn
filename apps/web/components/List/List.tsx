import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { MAX_WIDTH } from '../../constants'
import { Manga } from '../../lib/types'
import styles from './List.module.css'

type Props = {
  list: Manga[]
}

function AuthorLink({ authors, className, children }) {
  return (
    <Link
      href={{
        pathname: `/search`,
        query: {
          authors,
        },
      }}
    >
      <a className={className}>{children}</a>
    </Link>
  )
}

export function List({ list }: Props) {
  return (
    <div className="flex flex-col pb-4 gap-4">
      {list.map((item) => {
        const { fields } = item

        return (
          <div
            key={item.id}
            className="flex flex-col rounded-3xl shadow-lg bg-neutral-900"
          >
            <div
              className={clsx([styles.cover, 'rounded-3xl', 'overflow-hidden'])}
            >
              <Image
                src={fields.attachments?.[0].thumbnails.large.url}
                alt=""
                width={MAX_WIDTH}
                height={MAX_WIDTH}
              />
            </div>
            <div className="flex flex-col p-4 py-4 text-neutral-100">
              <div className="flex flex-wrap items-end gap-1 text-2xl">
                <span className="inline-flex">
                  {fields.title_ko || fields.title}
                </span>
                {fields.title_ko && (
                  <span className="inline-flex">
                    {fields.title && (
                      <span className="text-sm">({fields.title})</span>
                    )}
                  </span>
                )}
              </div>
              <div className="py-1 text-sm">
                {fields.authors.map((id, index) => {
                  return (
                    <AuthorLink
                      key={id}
                      authors={fields.authors}
                      className={styles.author}
                    >
                      {fields.authors_ko[index]}{' '}
                      <span className="text-xs">({fields.authors[index]})</span>
                    </AuthorLink>
                  )
                })}
              </div>
              <div className="flex justify-end py-4 hidden">
                <a
                  href="#"
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
