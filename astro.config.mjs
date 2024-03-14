import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'
import db from '@astrojs/db'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    react(),
    db(),
  ],
  output: 'server',
  adapter: vercel(),
})
