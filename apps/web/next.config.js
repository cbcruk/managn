const withTM = require('next-transpile-modules')(['ui'])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['dl.airtable.com'],
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localeDetection: true,
  },
})
