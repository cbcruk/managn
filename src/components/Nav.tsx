import type { Page } from 'astro'
import type { ComponentProps } from 'react'
import { twc } from 'react-twc'
import { Button } from '@components/ui/button'
import { twMerge } from 'tailwind-merge'

const LinkButton = twc.a`inline-flex justify-center h-[32px] min-w-[90px] p-2 rounded-full text-xs text-center`

export function NavButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={twMerge('rounded-full text-xs', props.className)}
      data-astro-prefetch
      asChild
    >
      <a>{props.children}</a>
    </Button>
  )
}

export function NavPrevButton(props: ComponentProps<typeof NavButton>) {
  return (
    <NavButton
      className="border border-red-200 bg-transparent hover:border-red-300 hover:bg-transparent text-red-200 hover:text-red-300"
      {...props}
    >
      이전 페이지
    </NavButton>
  )
}

export function NavNextButton(props: ComponentProps<typeof NavButton>) {
  return (
    <NavButton className="bg-red-200 hover:bg-red-300" {...props}>
      다음 페이지
    </NavButton>
  )
}

export const NavButtonGroup = twc.div`flex justify-end items-center gap-2 ml-auto`

export function NavStatus({
  lastPage,
  currentPage,
}: Pick<Page, 'lastPage' | 'currentPage'>) {
  return (
    <span className="text-neutral-100 text-xs">
      {lastPage} 중 {currentPage}페이지
    </span>
  )
}

export const Nav = twc.div`flex justify-between items-center`
