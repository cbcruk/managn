import clsx from 'clsx'
import Image from 'next/image'
import { MAX_WIDTH } from '../../constants'
import styles from './List.module.css'

export function List({ list }) {
  return (
    <div className="flex flex-col pb-4 gap-4">
      {list.map((item) => {
        return (
          <div
            key={item.id}
            className="flex flex-col rounded-3xl shadow-lg bg-neutral-900"
          >
            <div
              className={clsx([styles.cover, 'rounded-3xl', 'overflow-hidden'])}
            >
              <Image
                src={item.image}
                alt=""
                width={MAX_WIDTH}
                height={MAX_WIDTH}
              />
            </div>
            <div className="flex flex-col p-4 py-4 text-neutral-100">
              <div className="flex flex-wrap items-end gap-1 text-2xl">
                <span className="inline-flex">
                  {item.title_ko || item.title}
                </span>
                {item.title_ko && (
                  <span className="inline-flex">
                    {item.title && (
                      <span className="text-sm">({item.title})</span>
                    )}
                  </span>
                )}
              </div>
              <div className="py-1 text-sm">
                {item.authors_ko}{' '}
                <span className="text-xs">({item.authors})</span>
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
