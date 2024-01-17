import { defineCollection, reference, z } from 'astro:content'

const books = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      status: z.enum(['release', 'draft']),
      link: z.string().nullable(),
      title_ja: z.string().nullable(),
      title_ko: z.string().nullable(),
      authors: z.array(
        z.object({
          id: z.number(),
          name_ko: z.string().nullable(),
          name_ja: z.string().nullable(),
        })
      ),
      cover: image().nullable(),
    }),
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name_ko: z.string().nullable(),
    name_ja: z.string().nullable(),
    books: z.array(reference('books')),
  }),
})

export const collections = {
  books,
  authors,
}
