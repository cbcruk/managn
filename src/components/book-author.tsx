export function BookAuthor({ data }) {
  return (
    <a href={`/author/${data.id}`} className="inline-flex items-center gap-0.5">
      {data.name_ko}
      <span className="text-xs">({data.name_ja})</span>
    </a>
  )
}
