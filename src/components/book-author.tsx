import { Author } from '@/lib/db/schema'
import Link from 'next/link'

type BookAuthorProps = {
  data: Author
}

export function BookAuthor({ data }: BookAuthorProps) {
  return (
    <Link
      href={`/author/${data.id}`}
      className="inline-flex items-center gap-0.5"
    >
      {data.name_ko}
      <span className="text-xs">({data.name_ja})</span>
    </Link>
  )
}
