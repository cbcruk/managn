import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

await imagemin(['src/content/books/assets/*.{jpg,jpeg,png}'], {
  destination: 'src/content/books/assets',
  plugins: [imageminWebp()],
})
