import type { Author, Book } from '../db/schema'

export type BookWithCover = Book & {
  cover: string
}

export type BookWithAuthors = BookWithCover & {
  authors: Author[]
}

export type BookWithAuthorData = BookWithCover & {
  authorData: string
}

export type Pagination = {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
