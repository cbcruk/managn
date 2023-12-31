import { defineCollection, reference, z } from 'astro:content'

const books = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      status: z.enum(['release', 'draft']),
      link: z.string().nullable(),
      title_ja: z.string(),
      title_ko: z.string(),
      author: z.array(reference('authors')),
      author_ko: z.array(z.string()),
      author_ja: z.array(z.string()),
      cover: image().nullable(),
    }),
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name_ko: z.string(),
    name_ja: z.string(),
    books: z.array(reference('books')),
  }),
})

export const collections = {
  books,
  authors,
}
