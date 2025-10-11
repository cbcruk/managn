'use client'

import Image from 'next/image'
import { Input } from '../ui/input'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export function BookFormCover() {
  const params = useParams<{ id: string }>()
  const [cover, setCover] = useState<string | null>(
    params?.id ? `/books/${params?.id}.webp` : null
  )

  return (
    <div className="relative overflow-hidden inline-flex w-[160px] h-[227.5px] bg-zinc-900 rounded-md cursor-pointer">
      <Input
        type="file"
        id="cover"
        name="cover"
        accept="image/*"
        className="absolute opacity-0 w-full h-full"
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (file) {
            setCover(URL.createObjectURL(file))
          }
        }}
      />
      {cover && <Image src={cover} alt="" width={160} height={227.5} />}
    </div>
  )
}
