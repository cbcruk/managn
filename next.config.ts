import path from 'node:path'
import type { NextConfig } from 'next'

const COMP = '../vamp/packages'

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['imagemin', 'imagemin-webp'],
  turbopack: {
    // The linked packages live outside this project, so the file-watching root
    // has to reach them.
    root: path.join(process.cwd(), '..'),
    // `@comp/*` are linked from ../vamp, whose package entries point at
    // TypeScript source. Turbopack cannot follow the NodeNext `.js` specifiers
    // inside that source, so the app consumes the built output — the same
    // shape a published package would resolve to. Run `pnpm build` in vamp
    // (or `tsc -b --watch`) after changing a Comp package.
    resolveAlias: {
      '@comp/core': `${COMP}/core/dist/index.js`,
      '@comp/server': `${COMP}/server/dist/index.js`,
      '@comp/admin': `${COMP}/admin/dist/index.js`,
      // vamp has its own React, and two copies would give `@comp/admin` a
      // second hook dispatcher. Everything resolves to this app's.
      react: './node_modules/react',
      'react-dom': './node_modules/react-dom',
    },
  },
  outputFileTracingIncludes: {
    '/*': ['./managn.db'],
  },
}

export default nextConfig
