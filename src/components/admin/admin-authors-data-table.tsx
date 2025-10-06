'use client'

import type { Author } from 'db/schema'
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

type AdminAuthorsDataTableProps = {
  data: Author[]
}

type CellRendererAuthorParams = ICellRendererParams<Author>

ModuleRegistry.registerModules([AllCommunityModule])

const themeDarkWarm = themeQuartz.withPart(colorSchemeDark)

export function AdminAuthorsDataTable({ data }: AdminAuthorsDataTableProps) {
  const [rowData] = useState<Author[]>(data.toSorted((a, b) => b.id - a.id))
  const [colDefs] = useState<ColDef<Author>[]>([
    {
      field: 'id',
      sortable: true,
      headerName: 'ID',
      maxWidth: 80,
      cellRenderer: ({ data }: CellRendererAuthorParams) => {
        return <a href={`/admin/authors/${data?.id}`}>{data?.id}</a>
      },
    },
    { field: 'name_ko', headerName: '한국어', filter: true },
    { field: 'name_ja', headerName: '일본어', filter: true },
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
