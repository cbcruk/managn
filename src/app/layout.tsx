import '../styles/global.css'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata = {
  title: '홈 | managn',
  description: '추천만화',
  icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }],
} satisfies Metadata

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className="dark">
      <body>{children}</body>
    </html>
  )
}
