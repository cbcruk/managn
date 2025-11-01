import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['imagemin', 'imagemin-webp'],
  outputFileTracingIncludes: {
    '/*': ['./managn.db'],
  },
}

export default nextConfig
