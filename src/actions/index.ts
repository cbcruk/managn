'use server'

import {
  deleteBookAuthor,
  insertAuthorData,
  insertBook,
  createBookAuthor,
  updateAuthorData,
  updateBookData,
} from '@/lib/data'
import { createImage } from '@/lib/services/image'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type State = {
  data: boolean | null
  error: string | null
}

export async function updateBook(_prevState: State, formData: FormData) {
  const input = z.object({
    id: z.coerce.number(),
    title_ko: z.string(),
    title_ja: z.string(),
    status: z.string(),
    link: z.string().optional(),
    added_book_authors: z.string().array().optional(),
    deleted_book_authors: z.string().array().optional(),
    cover: z.instanceof(File).optional(),
  })

  const result = input.safeParse({
    id: formData.get('id'),
    title_ko: formData.get('title_ko'),
    title_ja: formData.get('title_ja'),
    status: formData.get('status'),
    link: formData.get('link'),
    added_book_authors: formData.getAll('added_book_authors'),
    deleted_book_authors: formData.getAll('deleted_book_authors'),
    cover: formData.get('cover'),
  })

  if (!result.success) {
    return {
      data: null,
      error: result.error.message,
    }
  }

  try {
    await updateBookData({
      id: result.data.id,
      title_ko: result.data.title_ko,
      title_ja: result.data.title_ja,
      status: result.data.status,
      link: result.data.link,
    })

    const addedBookAuthors = result.data.added_book_authors ?? []
    const deletedBookAuthors = result.data.deleted_book_authors ?? []

    if (addedBookAuthors.length > 0) {
      for (const authorId of addedBookAuthors) {
        await createBookAuthor({
          book_id: result.data.id,
          author_id: parseInt(authorId, 10),
        })
      }
    }

    if (deletedBookAuthors.length > 0) {
      for (const authorId of deletedBookAuthors) {
        await deleteBookAuthor({
          book_id: result.data.id,
          author_id: parseInt(authorId, 10),
        })
      }
    }

    if (result.data.cover) {
      await createImage(result.data.id, result.data.cover)
    }

    revalidatePath('/admin/books/')

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    const e = error as unknown as Error

    return {
      data: null,
      error: e.message,
    }
  }
}

export async function createBook(_prevState: State, formData: FormData) {
  const input = z.object({
    title_ko: z.string(),
    title_ja: z.string(),
    status: z.string(),
    link: z.string().optional(),
    added_book_authors: z.string().array().optional(),
    cover: z.instanceof(File).optional(),
  })

  const result = input.safeParse({
    title_ko: formData.get('title_ko'),
    title_ja: formData.get('title_ja'),
    status: formData.get('status'),
    link: formData.get('link'),
    added_book_authors: formData.getAll('added_book_authors'),
    cover: formData.get('cover'),
  })

  if (!result.success) {
    return {
      data: null,
      error: result.error.message,
    }
  }

  const book = await insertBook({
    title_ko: result.data.title_ko,
    title_ja: result.data.title_ja,
    status: result.data.status,
    link: result.data.link,
  })

  const addedBookAuthors = result.data.added_book_authors ?? []

  if (addedBookAuthors.length > 0) {
    for (const authorId of addedBookAuthors) {
      await createBookAuthor({
        book_id: book.id,
        author_id: parseInt(authorId, 10),
      })
    }
  }

  if (result.data.cover) {
    await createImage(book.id, result.data.cover)
  }

  revalidatePath('/admin/books/')

  redirect(`/admin/books/${book.id}`)
}

export async function updateAuthor(_prevState: State, formData: FormData) {
  const input = z.object({
    id: z.coerce.number(),
    name_ko: z.string(),
    name_ja: z.string(),
  })

  const result = input.safeParse({
    id: formData.get('id'),
    name_ko: formData.get('name_ko'),
    name_ja: formData.get('name_ja'),
  })

  if (!result.success) {
    return {
      data: null,
      error: result.error.message,
    }
  }

  await updateAuthorData({
    id: result.data.id,
    name_ko: result.data.name_ko,
    name_ja: result.data.name_ja,
  })

  return {
    data: true,
    error: null,
  }
}

export async function createAuthor(_prevState: State, formData: FormData) {
  const input = z.object({
    name_ko: z.string(),
    name_ja: z.string(),
  })

  const result = input.safeParse({
    name_ko: formData.get('name_ko'),
    name_ja: formData.get('name_ja'),
  })

  if (!result.success) {
    return {
      data: null,
      error: result.error.message,
    }
  }

  await insertAuthorData(result.data)

  return {
    data: true,
    error: null,
  }
}
