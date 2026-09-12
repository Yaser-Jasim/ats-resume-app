export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/app',
        '/account',
        '/history',
        '/result/',
        '/cover-letter/',
        '/hr',
        '/hr/result/',
        '/admin/',
        '/api/',
        '/login',
      ],
    },
    sitemap: 'https://getresemy.com/sitemap.xml',
  }
}