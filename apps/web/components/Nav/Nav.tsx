import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useI18n from '../../hooks/useI18n'

function LinkButton({ page, className, children }) {
  return (
    <Link href={`/manga/${page}`}>
      <a
        className={clsx(
          'inline-flex justify-center h-[32px] min-w-[90px] p-2 rounded-full text-xs text-center',
          className
        )}
      >
        {children}
      </a>
    </Link>
  )
}

export function Nav({ pagination = [] }) {
  const i18n = useI18n()
  const router = useRouter()
  const current = router.query?.page ?? 1
  const [prev, next, total] = pagination

  return (
    <div className="flex justify-between items-center">
      <span className="text-neutral-100 text-xs">
        {i18n.t('nav.page_of', {
          total,
          current,
        })}
      </span>
      <div className="flex justify-end items-center gap-2">
        <LinkButton page={prev} className="border border-red-200 text-red-200">
          {i18n.t('nav.previous')}
        </LinkButton>
        <LinkButton page={next} className="bg-red-200">
          {i18n.t('nav.next')}
        </LinkButton>
      </div>
    </div>
  )
}
