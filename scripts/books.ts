import * as fs from 'fs/promises'
import books from './books.json'
import authors from './authors.json'

const mime = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
}

async function main() {
  const path = './src/content/books'

  for (const book of books) {
    const hasAttachments = Boolean(book.fields.attachments)

    await fs.writeFile(
      `${path}/${book.fields.index}.json`,
      JSON.stringify(
        {
          status: book.fields?.status ?? 'draft',
          link: book.fields?.link ?? null,
          title_ko: book.fields?.title_ko ?? '',
          title_ja: book.fields?.title ?? '',
          author: authors
            .filter(
              (author) =>
                book.fields.authors?.includes(author.name_ja) ||
                book.fields.authors_ko?.includes(author.name_ko)
            )
            .map((author) => `${author.index}`),
          author_ko: book.fields?.authors_ko ?? [],
          author_ja: book.fields?.authors ?? [],
          cover: hasAttachments
            ? `./assets/${book.fields.index}.${
                mime[book.fields.attachments?.[0].type ?? '']
              }`
            : null,
        },
        null,
        2
      )
    )

    // if (book.fields.attachments) {
    //   const response = await fetch(book.fields.attachments[0].url, {
    //     headers: {
    //       'Content-Type': book.fields.attachments[0].type,
    //     },
    //   })
    //   const blob = await response.blob()
    //   const data = await blob.arrayBuffer()

    //   const extension = mime[book.fields.attachments[0].type]

    //   await fs.writeFile(
    //     `${path}/assets/${book.fields.index}.${extension}`,
    //     data as NodeJS.ArrayBufferView
    //   )
    // }
  }
}
main()
