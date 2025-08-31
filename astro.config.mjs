import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://managn.vercel.app/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    sitemap(),
  ],
  prefetch: true,
  output: 'server',
  adapter: vercel({
    includeFiles: ['./managn.db'],
  }),
})
