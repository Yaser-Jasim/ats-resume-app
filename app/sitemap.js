export default function sitemap() {
  const baseUrl = 'https://getresemy.com'

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/welcome/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/account/plans', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/welcome/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/welcome/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/help', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}