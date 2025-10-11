'use client'

import type { Book } from '@/lib/db/schema'
import { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  colorSchemeDark,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community'
import Link from 'next/link'

type AdminBooksDataTableProps = {
  data: Book[]
}

type CellRendererBookParams = ICellRendererParams<Book>

ModuleRegistry.registerModules([AllCommunityModule])

const themeDarkWarm = themeQuartz.withPart(colorSchemeDark)

export function AdminBooksDataTable({ data }: AdminBooksDataTableProps) {
  const [rowData] = useState<Book[]>(data)
  const [colDefs] = useState<ColDef<Book>[]>([
    {
      field: 'id',
      sortable: true,
      headerName: 'ID',
      maxWidth: 80,
      cellRenderer: ({ data }: CellRendererBookParams) => {
        return <Link href={`/admin/books/${data?.id}`}>{data?.id}</Link>
      },
    },
    {
      headerName: '커버',
      maxWidth: 80,
      cellRenderer: ({ data }: CellRendererBookParams) => {
        if (data?.status !== 'release') {
          return null
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/books/${data.id}.webp`}
            alt=""
            width={36}
            height={36}
            className="m-0.5 rounded-sm object-cover aspect-square"
          />
        )
      },
    },
    { field: 'title_ko', headerName: '한국어', filter: true },
    { field: 'title_ja', headerName: '일본어', filter: true },
    {
      field: 'status',
      headerName: '상태',
      flex: 0,
      filter: false,
      sortable: true,
      maxWidth: 80,
      cellRenderer: ({ data }: CellRendererBookParams) => {
        return data?.status === 'release' ? '✅' : '☑️'
      },
    },
  ])

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: false,
    autoHeight: false,
  }

  return (
    <div style={{ height: `calc(100vh - (var(--spacing) * 8))` }}>
      <AgGridReact
        theme={themeDarkWarm}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  )
}
