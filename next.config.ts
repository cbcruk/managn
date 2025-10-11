import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['imagemin', 'imagemin-webp'],
  outputFileTracingIncludes: {
    '/*': ['./managn.db'],
  },
}

export default nextConfig
