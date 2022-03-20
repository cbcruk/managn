import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

function LinkButton({ page, className, children }) {
  return (
    <Link href={`/page/${page}`}>
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
  const router = useRouter()
  const current = router.query?.page ?? 1
  const [prev, next, total] = pagination

  return (
    <div className="flex justify-between items-center">
      <span className="text-neutral-100 text-xs">{`Page ${current} of ${total}`}</span>
      <div className="flex justify-end items-center gap-2">
        <LinkButton page={prev} className="border border-red-200 text-red-200">
          Previous page
        </LinkButton>
        <LinkButton page={next} className="bg-red-200">
          Next page
        </LinkButton>
      </div>
    </div>
  )
}
