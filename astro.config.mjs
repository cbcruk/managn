import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://managn.vercel.app/',
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    sitemap(),
  ],
  prefetch: true,
  output: 'server',
  adapter: vercel(),
})
