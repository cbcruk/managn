import * as fs from 'fs/promises'
import books from './books.json'
import authors from './authors.json'

async function main() {
  const path = './src/content/authors'

  for (const author of authors) {
    const { name_ko, name_ja, index } = author

    await fs.writeFile(
      `${path}/${index + 1}.json`,
      JSON.stringify(
        {
          name_ko,
          name_ja,
          books: books
            .filter(
              (book) =>
                book.fields.authors?.includes(name_ja) ||
                book.fields.authors_ko?.includes(name_ko)
            )
            .map((book) => `${book.fields.index}`),
        },
        null,
        2
      )
    )
  }
}
main()
