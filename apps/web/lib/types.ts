export interface Manga {
  id: string
  createdTime: string
  fields: Fields
}

interface Fields {
  title: string
  attachments: {
    id: string
    width: number
    height: number
    url: string
    filename: string
    size: number
    type: string
    thumbnails: {
      small: Thumbnail
      large: Thumbnail
      full: Thumbnail
    }
  }[]
  status: string
  link: string
  timestamp: string
  title_ko: string
  index: number
  table2: string[]
  table3: string[]
  created: string
  last_modified: string
  authors_ko: string[]
  authors: string[]
  record_id: string
}

interface Thumbnail {
  url: string
  width: number
  height: number
}

export interface Author {
  id: string
  createdTime: string
  fields: {
    author: string
    author_ko: string
    record_id: string
    title_ko: string[]
  }
}
