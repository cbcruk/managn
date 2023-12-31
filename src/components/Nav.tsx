import type { Page } from 'astro'
import type { ComponentProps } from 'react'
import { twc } from 'react-twc'
import { P, match } from 'ts-pattern'

const LinkButton = twc.a`inline-flex justify-center h-[32px] min-w-[90px] p-2 rounded-full text-xs text-center`

export function NavButton(props: ComponentProps<typeof LinkButton>) {
  return match(props)
    .with({ href: P.nullish }, () => null)
    .otherwise(({ children, ...props }) => (
      <LinkButton {...props}>{children}</LinkButton>
    ))
}

export function NavPrevButton(props: ComponentProps<typeof LinkButton>) {
  return (
    <NavButton className="border border-red-200 text-red-200" {...props}>
      이전 페이지
    </NavButton>
  )
}

export function NavNextButton(props: ComponentProps<typeof LinkButton>) {
  return (
    <NavButton className="bg-red-200" {...props}>
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
