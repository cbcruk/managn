import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container } from '../Container'
import { AutoStories, Bookmakrs, People } from '../Icons'

function NavigationItem({ isActive, label, children }) {
  return (
    <div className="flex flex-col justify-center items-center text-xs">
      <span
        className={clsx(
          'flex justify-center items-center w-[64px] h-[24px] rounded-full mb-[4px]',
          {
            'bg-neutral-700': isActive,
          }
        )}
      >
        {children}
      </span>
      <span
        className={clsx({
          'font-medium': isActive,
        })}
      >
        {label}
      </span>
    </div>
  )
}

export function Navigation() {
  const router = useRouter()

  return (
    <div className="sticky bottom-0 z-10 bg-stone-900 text-purple-100">
      <Container className="flex items-center justify-between p-4 py-3">
        <Link href="/manga">
          <a>
            <NavigationItem
              label="만화"
              isActive={['/manga', '/manga/[page]'].includes(router.route)}
            >
              <AutoStories />
            </NavigationItem>
          </a>
        </Link>
        <Link href="/authors">
          <a>
            <NavigationItem
              label="작가"
              isActive={['/authors', '/authors/[author]'].includes(
                router.route
              )}
            >
              <People />
            </NavigationItem>
          </a>
        </Link>
        <Link href="/bookmarks">
          <a>
            <NavigationItem
              label="즐겨찾기"
              isActive={router.asPath === '/bookmarks'}
            >
              <Bookmakrs />
            </NavigationItem>
          </a>
        </Link>
      </Container>
    </div>
  )
}
